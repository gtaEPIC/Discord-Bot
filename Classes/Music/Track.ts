import {
    GuildMember,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    MessageOptions,
    MessageSelectMenu
} from "discord.js";
import {AudioResource, createAudioPlayer, createAudioResource} from "@discordjs/voice";
import * as stream from "stream";
import Queue, {LoopModes} from "./Queue";
import {MessageButtonStyles} from "discord.js/typings/enums";
import ytdl = require("ytdl-core");

export default class Track {
    name: string;
    author: string;
    url: string;
    requested: GuildMember;
    type: string;
    duration: number;
    queue: Queue;

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

        this.source.addListener("close", () => console.log("YTDL Closed"));
        this.source.addListener("error", err => console.error("YTDL ERROR:", err));
        this.source.addListener("error", (err => onError(err)));
        this.source.addListener("pause", () => console.log("YTDL Paused"));
        this.source.addListener("data", () => console.log("YTDL Data"));
        //this.source.addListener("readable", () => console.log("YTDL Readable"));
        this.source.addListener("end", () => console.log("YTDL End"));
        this.source.addListener("resume", () => console.log("YTDL Resume"));

    }


    constructor(name: string, author: string, url: string, requested: GuildMember, duration: number, type: string, queue: Queue) {
        this.name = name;
        this.author = author;
        this.url = url;
        this.requested = requested;
        this.duration = duration;
        this.type = type;
        this.queue = queue;
    }

    async makeAnnouncement() {
        try {
            let prevButton: MessageButton = new MessageButton()
                .setStyle(MessageButtonStyles.SECONDARY)
                .setLabel("⏮ Previous Track")
                .setCustomId("previous")
                .setDisabled(this.queue.history.length === 0);
            let playPauseButton: MessageButton = new MessageButton()
                .setStyle(MessageButtonStyles.PRIMARY)
                .setLabel("⏯ | " + (this.queue.paused ? "Play" : "Pause"))
                .setCustomId((this.queue.paused ? "play" : "pause"));
            let stopButton: MessageButton = new MessageButton()
                .setStyle(MessageButtonStyles.DANGER)
                .setLabel("⏹ | Stop")
                .setCustomId("stop");
            let nextButton: MessageButton = new MessageButton()
                .setStyle(MessageButtonStyles.SECONDARY)
                .setLabel("⏭ | " + (this.queue.songs.length > 0 ? "Next Track" : "Skip"))
                .setCustomId("skip");
            let placeholder;
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
            let loopSelection: MessageSelectMenu = new MessageSelectMenu()
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
            let actionRow: MessageActionRow = new MessageActionRow({components: [prevButton, playPauseButton, stopButton, nextButton]});
            let actionRow2: MessageActionRow = new MessageActionRow({components: [loopSelection]})
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
        this.initSource(await ytdl(this.url, {
            filter: "audio",
            quality: "lowestaudio",
            begin: point,
            highWaterMark: 1<<25
        }), (err1) => this.error(err1))
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
            let playNextButton: MessageButton = new MessageButton()
                .setStyle(MessageButtonStyles.PRIMARY)
                .setLabel("Play Next")
                .setCustomId("playnext-" + this.url);
            let playLastButton: MessageButton = new MessageButton()
                .setStyle(MessageButtonStyles.SECONDARY)
                .setLabel("Add to queue")
                .setCustomId("playlast-" + this.url);
            let actionRow: MessageActionRow = new MessageActionRow({components: [playNextButton, playLastButton]})
            let details: MessageEmbed = new MessageEmbed()
                .setTitle("Error Details")
                .setDescription("The song in the queue failed to play due to an error")
                .addField("Message", err.message)
                .addField("Song", "[" + this.name + "](" + this.url + ")")
                .addField("Requested by", "<@" + this.requested.id + ">");
            let contents: MessageOptions = {
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