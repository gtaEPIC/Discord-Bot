import { Client, Intents } from "discord.js";
import OnReady from "./Classes/Events/OnReady";
require("dotenv").config();
import GuildCreate from "./Classes/Events/GuildCreate";
import InteractionCreated from "./Classes/Events/InteractionCreated";
import {DisTube} from "distube";

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

export const player = new DisTube(client, {
    searchSongs: 1,
    searchCooldown: 30,
    leaveOnEmpty: false,
    emptyCooldown: 0,
    leaveOnFinish: false,
    leaveOnStop: true,
})

function timeToSeconds(time: string): number {
    let mins = time.split(":")[0];
    let secs = time.split(":")[1];
    let seconds = parseInt(secs);
    seconds += parseInt(mins) * 60;
    return seconds;
}

player.on("playSong", (queue, track) => {
    queue.textChannel.send(`🎶 | Now playing **${track.name}**!`).then();
})

client.on("ready", OnReady);

client.on("guildCreate", GuildCreate)

client.on("interactionCreate", InteractionCreated);

client.login(process.env.BOT).then();