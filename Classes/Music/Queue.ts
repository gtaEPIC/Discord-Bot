import Track from "./Track";
import {Guild, GuildMember, Message, StageChannel, TextChannel, VoiceChannel} from "discord.js";
import {
    AudioPlayer,
    AudioPlayerState,
    AudioPlayerStatus,
    DiscordGatewayAdapterCreator,
    joinVoiceChannel,
    VoiceConnection
} from "@discordjs/voice";
import * as ytdl from "@distube/ytdl-core";
import * as ytSearch from "yt-search";
import * as ytlist from "youtube-search-api";
import Player from "./Player";
import {secondsToTime} from "../Extras";
import PlayList from "./PlayList";
import scdl from "soundcloud-downloader";

export enum LoopModes {
    OFF,
    TRACK,
    QUEUE
}

export class searchErrorReason {
    reason: string
}

export default class Queue {
    textChannel: TextChannel;
    voiceChannel: VoiceChannel | StageChannel;
    connection: VoiceConnection = null;
    songs: Array<Track> = [];
    history: Array<Track> = [];
    playing: Track;
    //volume: number = 5;
    paused: boolean = false;
    guild: Guild;
    player: Player;
    audioPlayer: AudioPlayer;
    loop: LoopModes = LoopModes.OFF;
    statedLoop: LoopModes;
    statedPause: boolean;
    skipping: boolean = false;
    shuffling: boolean = false;

    constructor(player: Player, guild: Guild, voice: VoiceChannel | StageChannel, textChannel?: TextChannel) {
        this.player = player;
        this.guild = guild;
        this.voiceChannel = voice;
        if (textChannel) this.textChannel = textChannel;
    }

    connect(newVoice?: VoiceChannel | StageChannel) {
        if (newVoice) this.voiceChannel = newVoice;
        this.connection = joinVoiceChannel({
            channelId: this.voiceChannel.id,
            guildId: this.guild.id,
            adapterCreator: <DiscordGatewayAdapterCreator><unknown>this.guild.voiceAdapterCreator
        })
    }

    async createConnection(replied: Message) {
        try {
            if (!this.connection) {
                await replied.edit("🔈 | Attempting to join channel")
                this.connect()
            }
        } catch (e) {
            console.log(e);
            await replied.edit({ content: "❌ | An error occurred while attempting to join!" });
            this.delete()
            return
        }
    }

    resume() {
        this.paused = false;
        this.audioPlayer.unpause();
    }

    pause() {
        this.paused = true;
        this.audioPlayer.pause();
    }

    addTrack(track: Track, position = -1) {
        if (position < 0) this.songs.push(track);
        else if (position === 0) this.songs.unshift(track);
        else this.songs.splice(position, 0, track);
    }

    play(track: Track, playNext = false) {
        if (playNext) this.addTrack(track, 0);
        else this.addTrack(track);
        //if (this.paused) this.resume()
        if (!this.playing) this.next().then();
    }

    stateChange(oldState: AudioPlayerState, newState: AudioPlayerState) {
        let track: Track = this.playing;
        //console.log("Time Check: ", Math.floor(oldState["playbackDuration"] / 1000), track.duration - 5)
        console.log("STATE CHANGE", oldState, newState, track);
        if (this.skipping) {
            this.skipping = false;
            this.onEnd().then();
            return;
        }
        if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Buffering && (!track.live && Math.floor(oldState["playbackDuration"] / 1000) >= track.duration - 1))
            this.onEnd().then();
        else if (newState.status === AudioPlayerStatus.Idle)
            track.error({message: "Feed Stopped"}).then();
        else if (newState.status === AudioPlayerStatus.AutoPaused) setTimeout(() => this.audioPlayer?.unpause(), 2000)
    }

    createStateCheck() {
        this.audioPlayer.on("stateChange", (oldState, newState) => this.stateChange(oldState, newState));
    }

    async next() {
        this.playing = this.songs.shift();
        if (!this.playing) {
            this.onEmpty();
            return;
        }
        let track: Track = this.playing;
        await track.play(0);
        this.player.onStart(this, track);
    }

    getTime(): number {
        if (this.audioPlayer) {
            if (this.audioPlayer.state["playbackDuration"]) return Math.floor(this.audioPlayer.state["playbackDuration"] / 1000)
            else return -1;
        }
        return -1;
    }


    updateHistory(track: Track) {
        this.history.unshift(track);
        if (this.history.length > 5) {
            this.history.splice(this.history.length, 1);
        }
    }

    skip() {
        this.skipping = true;
        this.audioPlayer.stop();
    }

    stop() {
        this.songs = [];
        this.audioPlayer.stop(true);
        this.audioPlayer = null;
        this.playing?.onEnd();
        this.playing = null;
        this.connection.disconnect();
        this.connection = null;
    }

    rewind(): boolean {
        if (this.history.length < 1) return false;
        if (this.playing) {
            this.playing.attempts = 0
            this.addTrack(this.playing, 0);
        }
        this.addTrack(this.history.shift(), 0)
        this.playing?.onEnd()
        this.next().then();
        //this.skip();
        return true;
    }

    shuffle(message?: Message) {
        if (this.shuffling) throw new Error("Already shuffling!")
        this.shuffling = true;
        let total = this.songs.length;
        let lastUpdate = 0;
        let emojiState = false;
        let newList = [];
        for (let i = 0; i < total; i++) {
            // Randomly pick an element to remove and add to the new list
            let index = Math.floor(Math.random() * this.songs.length);
            newList.push(this.songs[index]);
            this.songs.splice(index, 1);
            // Update the message every 5 seconds
            if (lastUpdate + 5000 < Date.now()) {
                let emoji = "⏳"
                if (emojiState) emoji = "⌛"
                emojiState = !emojiState
                message?.edit({content: emoji + " | Shuffling the queue (" + (i + 1) + "/" + total + ")"})
                lastUpdate = Date.now();
            }
        }
        // If there are any songs left in the old list, add them to the new list
        if (this.songs.length > 0) newList.concat(this.songs);
        // Set the new list as the current list
        this.songs = newList;
        message?.edit({content: "🔀 | Finished shuffling the queue"})
        this.shuffling = false;
    }

    getProgressBar(size: number, includeTimes: boolean): string {
        //size--;
        if (!this.playing.live) {
            let dot = Math.floor(this.getTime() / this.playing.duration * size);
            let final = "**|";
            for (let i = 0; i < size; i++) {
                if (i <= dot) final += "🔸";
                else final += "🔹"
            }
            final += "|** ";
            if (this.getTime() === -1) includeTimes = false;
            if (includeTimes) final += secondsToTime(this.getTime()) + "/" + secondsToTime(this.playing.duration);
            return final;
        }else{
            if (includeTimes) return "🔴 | Live Stream";
            else return "🔴";
        }
    }

    async onEnd() {
        if (this.player.onEnd) this.player.onEnd(this, this.playing);
        this.playing.attempts = 0
        if (this.loop === LoopModes.TRACK) this.addTrack(this.playing, 1);
        if (this.loop === LoopModes.QUEUE) this.addTrack(this.playing);
        this.updateHistory(this.playing);
        this.playing.onEnd()
        this.playing = null;
        await this.next();
    }

    onEmpty() {
        if (this.player.onEmpty) this.player.onEmpty(this);
    }

    async search(request: string, member: GuildMember, message?: Message): Promise<Track | PlayList | searchErrorReason | null> {
        try {
            if (!request.startsWith("http")) {
                let response = await ytSearch(request);
                if (!response?.all?.length) return {reason: "No Results Found"};
                request = response.all[0].url;
            }
            if (request.includes("youtube") || request.includes("youtu.be")) {
                if (request.includes("list")) {
                    let id = "";
                    let args = request.split("?")[1].split("&")
                    for (let arg of args) {
                        if (arg.startsWith("list")) id = arg.split("=")[1]
                    }
                    // https://www.youtube.com/watch?v=KcjUtebWrO4&list=PLaX_-TSNsrwQ6_BygacrWz9bFGeTXaKdE&index=1
                    let response = await ytlist.GetPlaylistData(id);
                    console.log(response)
                    let playlist: PlayList = new PlayList()
                    playlist.name = response.metadata.playlistMetadataRenderer.title
                    let count = 0;
                    let emojiState = false
                    let lastUpdate = 0;
                    for (const track of response.items) {
                        count++;
                        if (lastUpdate + 5000 < Date.now()) {
                            let emoji = "⏳"
                            if (emojiState) emoji = "⌛"
                            emojiState = !emojiState
                            message?.edit({content: emoji + " | Adding songs to queue (" + count + "/" + response.items.length + ")"})
                            lastUpdate = Date.now();
                        }
                        try {
                            let details: ytdl.videoInfo = await ytdl.getInfo("https://www.youtube.com/watch?v=" + track.id)
                            playlist.tracks.push(new Track(
                                details.videoDetails.title,
                                details.videoDetails.author.name,
                                details.videoDetails.video_url,
                                details.videoDetails.video_url,
                                member,
                                parseInt(details.videoDetails.lengthSeconds),
                                "youtube",
                                this
                            ))
                        }catch (e) {
                            console.error(e)
                            if (message) {
                                message.channel.send("❌ | An error occurred trying to add a song to the queue!\n" +
                                    "Song: [" + track.title + "](https://youtube.com/watch?v=" + track.id + ")\n" +
                                    "Reason: " + e.message)
                            }
                        }
                    }
                    return playlist
                } else {
                    let response: ytdl.videoInfo = await ytdl.getInfo(request);
                    console.log(response.videoDetails.lengthSeconds);
                    return new Track(
                        response.videoDetails.title,
                        response.videoDetails.author.name,
                        response.videoDetails.video_url,
                        response.videoDetails.video_url,
                        member,
                        parseInt(response.videoDetails.lengthSeconds),
                        "youtube",
                        this,
                        response.videoDetails.isLiveContent
                    );
                }
            }else if (request.includes("soundcloud") && scdl.isValidUrl(request)) {
                let response = await scdl.getInfo(request)
                console.log(response)
                return new Track(
                    response.title,
                    response.user.username,
                    request,
                    response.uri,
                    member,
                    Math.floor(response.duration / 1000),
                    "soundcloud",
                    this
                )
            }else{
                return {reason: "Unsupported source"}
            }
        }catch (e) {
            console.error(e);
            return null;
        }
    }

    delete() {
        this.player.queues.delete(this.guild.id);
    }

}