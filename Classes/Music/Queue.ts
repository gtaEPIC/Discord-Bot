import Track from "./Track";
import {Guild, GuildMember, StageChannel, TextChannel, VoiceChannel} from "discord.js";
import {
    AudioPlayer,
    AudioPlayerState,
    AudioPlayerStatus,
    DiscordGatewayAdapterCreator,
    joinVoiceChannel,
    VoiceConnection
} from "@discordjs/voice";
import * as ytdl from "ytdl-core";
import * as ytSearch from "yt-search";
import Player from "./Player";
import {secondsToTime} from "../Extras";

export enum LoopModes {
    OFF,
    TRACK,
    QUEUE
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
        else this.songs.unshift(track);
    }

    play(track: Track) {
        this.addTrack(track);
        //if (this.paused) this.resume()
        if (!this.playing) this.next().then();
    }

    stateChange(oldState: AudioPlayerState, newState: AudioPlayerState) {
        let track: Track = this.playing;
        //console.log("Time Check: ", Math.floor(oldState["playbackDuration"] / 1000), track.duration - 5)
        console.log("STATE CHANGE", oldState, newState, track);
        if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Buffering && Math.floor(oldState["playbackDuration"] / 1000) <= track.duration - 1)
            this.onEnd().then();
        else if (newState.status === AudioPlayerStatus.Idle)
            track.error({message: "Feed Stopped"}).then();
        else if (newState.status === AudioPlayerStatus.AutoPaused) setTimeout(() => this.audioPlayer.unpause(), 2000)
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
        this.audioPlayer.stop();
    }

    stop() {
        this.songs = [];
        this.audioPlayer.stop();
        this.connection.disconnect();
    }

    rewind(): boolean {
        if (this.history.length < 1) return false;
        if (this.playing) {
            this.playing.attempts = 0
            this.addTrack(this.playing, 1);
        }
        this.addTrack(this.history.shift(), 1)
        this.playing?.onEnd()
        this.next().then();
        //this.skip();
        return true;
    }

    getProgressBar(size: number, includeTimes: boolean): string {
        //size--;
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

    async search(request: string, member: GuildMember): Promise<Track | null> {
        try {
            if (!request.startsWith("http")) {
                let response = await ytSearch(request);
                if (!response?.all?.length) return null;
                request = response.all[0].url;
            }
            let response: ytdl.videoInfo = await ytdl.getInfo(request);
            console.log(response.videoDetails.lengthSeconds);
            return new Track(
                response.videoDetails.title,
                response.videoDetails.author.name,
                response.videoDetails.video_url,
                member,
                parseInt(response.videoDetails.lengthSeconds),
                "youtube",
                this
            );
        }catch (e) {
            console.log(e);
            return null;
        }
    }

    delete() {
        this.player.queues.delete(this.guild.id);
    }

}