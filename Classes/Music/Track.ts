import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle, EmbedBuilder,
    GuildMember,
    Message, MessageCreateOptions, SelectMenuBuilder
} from "discord.js";
import {AudioResource, createAudioPlayer, createAudioResource} from "@discordjs/voice";
import * as stream from "stream";
import Queue, {LoopModes} from "./Queue";
import YouTube from "./Downloaders/YouTube";
import SoundCloud from "./Downloaders/SoundCloud";

export default class Track {
    name: string;
    author: string;
    url: string;
    requested: GuildMember;
    type: string;
    duration: number;
    queue: Queue;

    sourceLink: string
    source: stream.Readable;
    resource: AudioResource<null>;

    attempts = 0;
    maxAttempts = 3;
    lastError: number;

    announcement: Message;
    updater: number;

    initSource(source: stream.Readable, onError: (err) => void) {
        this.source = source;
        this.resource = createAudioResource(this.source);

        this.source.addListener("close", () => console.log("Stream Closed"));
        this.source.addListener("error", err => console.error("Stream ERROR:", err));
        this.source.addListener("error", (err => onError(err)));
        this.source.addListener("pause", () => {
            //console.log("Stream Paused");
        });
        this.source.addListener("data", () => {
            //console.log("Stream Data");
        });
        //this.source.addListener("readable", () => console.log("YTDL Readable"));
        this.source.addListener("end", () => console.log("Stream End"));
        this.source.addListener("resume", () => {
            //console.log("Stream Resume");
        });

    }


    constructor(name: string, author: string, url: string, sourceLink: string, requested: GuildMember, duration: number, type: string, queue: Queue) {
        this.name = name;
        this.author = author;
        this.url = url;
        this.sourceLink = sourceLink
        this.requested = requested;
        this.duration = duration;
        this.type = type;
        this.queue = queue;
    }

    async makeAnnouncement() {
        try {
            let prevButton: ButtonBuilder = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("⏮ Previous Track")
                .setCustomId("previous")
                .setDisabled(this.queue.history.length === 0);
            let playPauseButton: ButtonBuilder = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("⏯ | " + (this.queue.paused ? "Play" : "Pause"))
                .setCustomId((this.queue.paused ? "play" : "pause"));
            let stopButton: ButtonBuilder = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("⏹ | Stop")
                .setCustomId("stop");
            let nextButton: ButtonBuilder = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("⏭ | " + (this.queue.songs.length > 0 ? "Next Track" : "Skip"))
                .setCustomId("skip");
            let placeholder: string
            switch (this.queue.loop) {
                case LoopModes.OFF:
                    placeholder = "Loop Off";
                    break;
                case LoopModes.TRACK:
                    placeholder = "Loop Song";
                    break;
                case LoopModes.QUEUE:
                    placeholder = "Loop Queue";
                    break;
                default:
                    placeholder = "Loop Off";
                    break;
            }
            let loopSelection: SelectMenuBuilder = new SelectMenuBuilder()
                .setCustomId("loop")
                .addOptions([
                    {
                        label: "Loop Off",
                        value: "off",
                        description: "Current song won't loop",
                        default: this.queue.loop === LoopModes.OFF
                    },
                    {
                        label: "Loop Song",
                        value: "song",
                        description: "Loops the current song",
                        default: this.queue.loop === LoopModes.TRACK
                    },
                    {
                        label: "Loop Queue",
                        value: "queue",
                        description: "Loops the entire queue",
                        default: this.queue.loop === LoopModes.QUEUE
                    }
                ])
                .setMinValues(1)
                .setMaxValues(1)
                .setPlaceholder(placeholder);
            //console.log(this.loop);
            let changedState: boolean = this.queue.statedLoop !== this.queue.loop || this.queue.statedPause !== this.queue.paused;
            this.queue.statedLoop = this.queue.loop;
            this.queue.statedPause = this.queue.paused;
            let actionRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>({components: [prevButton, playPauseButton, stopButton, nextButton]});
            let actionRow2: ActionRowBuilder<SelectMenuBuilder> = new ActionRowBuilder<SelectMenuBuilder>({components: [loopSelection]})
            let track: Track = this.queue.playing;
            let first: boolean = this.announcement === undefined
            let message: string = (!this.queue.paused ? "🎶 | Now playing" : "⏸ | Paused on") + ` **${track.name}**!\n${this.queue.getProgressBar(20, !first)}`
            if (this.attempts > 1) {
                message += "\n⚠ | An issue occurred trying to play the audio. Trying again. (Attempt " + track.attempts + "/" + this.maxAttempts + ")"
            }
            if (first) this.announcement = await this.queue.textChannel.send({
                content: message,
                components: [actionRow, actionRow2]
            })
            else if (changedState) await this.announcement.edit({
                content: message,
                components: [actionRow, actionRow2]
            })
            else await this.announcement.edit({
                    content: message
                });
        } catch (e) {
            console.error(e)
        }
    }

    onEnd() {
        this.announcement?.delete().then();
        this.announcement = undefined;
        clearInterval(this.updater);
    }

    async play(point: number) {
        this.attempts++;
        let data: stream.Readable;
        if (this.type === "youtube") data = await new YouTube().download(this.sourceLink, point);
        else if (this.type === "soundcloud") data = await new SoundCloud().download(this.sourceLink, point)
        this.initSource(data, (err1) => this.error(err1))
        if (!this.queue.audioPlayer) {
            this.queue.audioPlayer = this.queue.connection.subscribe(createAudioPlayer({
                debug: true
            })).player
            this.queue.createStateCheck();
            this.queue.audioPlayer.on("error", error => console.error("AUDIO PLAYER ERROR:", error));
        }
        this.queue.audioPlayer.play(this.resource);
    }

    async error(err) {
        if (this.lastError >= Math.floor(Date.now() / 1000) - 5) return;
        this.lastError = Math.floor(Date.now() / 1000)
        console.error("Track ERROR was thrown:", err);
        console.log("Track:", this)
        let point: number = this.resource.playbackDuration - 1000;
        if (point < 0) point = 0;
        if (this.attempts >= this.maxAttempts) {
            let playNextButton: ButtonBuilder = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel("Play Next")
                .setCustomId("playnext+=+" + this.url);
            let playLastButton: ButtonBuilder = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Add to queue")
                .setCustomId("playlast+=+" + this.url);
            let actionRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>({components: [playNextButton, playLastButton]})
            let details: EmbedBuilder = new EmbedBuilder()
                .setTitle("Error Details")
                .setDescription("The song in the queue failed to play due to an error")
                .addFields([
                    {name: "Message", value: err.message},
                    {name: "Song", value: "[" + this.name + "](" + this.url + ")"},
                    {name: "Requested by", value: "<@" + this.requested.id + ">"},
                ])
            let contents: MessageCreateOptions = {
                content: "❌ | An error occurred while playing the song. Attempts: " + this.attempts + "/" + this.maxAttempts,
                embeds: [details],
                components: [actionRow]
            }
            await this.queue.textChannel.send(contents);
            this.queue.onEnd().then();
        } else {
            try {
                //clearInterval(this.updater);
                //let message: string = "⚠ | An issue occurred trying to play the audio. Trying again. (Attempt " + track.attempts + "/" + maxAttempts + ")";
                //await this.textChannel.send(message);
                await this.play(point);
            } catch (e) {
                console.log("The ERROR caused an ERROR" + e)
                await this.error(err)
            }
        }

    }
}