import Queue from "./Queue";
import {Client, Guild, StageChannel, TextChannel, VoiceChannel} from "discord.js";
import Track from "./Track";

export interface onEndFunction {(queue: Queue, track: Track): void;}
export interface onEmptyFunction {(queue: Queue): void;}
export interface onStartFunction {(queue: Queue, track: Track): void;}

export default class Player {
    queues: Map<string, Queue> = new Map<string, Queue>();
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    createQueue(guild: Guild, vc: VoiceChannel | StageChannel, textChannel?: TextChannel) {
        if (this.queues.has(guild.id)) return this.queues.get(guild.id);
        let queue: Queue = new Queue(this, guild, vc, textChannel);
        this.queues.set(guild.id, queue);
        return queue;
    }

    onEnd: onEndFunction;
    onEmpty: onEmptyFunction;
    onStart: onStartFunction;

    on(eventName: string, event: onStartFunction | onEmptyFunction | onEndFunction) {
        switch (eventName) {
            case "onEnd":
                this.onEnd = event;
                break;
            case "onEmpty":
                this.onEmpty = <onEmptyFunction>event;
                break;
            case "onStart":
                this.onStart = event;
                break;
            default:
                throw new Error(eventName + " is not a valid event");
        }
    }


}