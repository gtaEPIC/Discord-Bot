import {Client, Intents} from "discord.js";
import OnReady from "./Classes/Events/OnReady";
import GuildCreate from "./Classes/Events/GuildCreate";
import InteractionCreated from "./Classes/Events/InteractionCreated";
import Player from "./Classes/Music/Player";
import SQLSetup from "./Classes/SQL/setup/SQLSetup";
import {dbFile} from "./Classes/Extras";

require("dotenv").config();

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})

SQLSetup(dbFile).then();

export const player = new Player(client)

player.on("onStart", (queue, track) => {
    track.makeAnnouncement().then();
    track.updater = setInterval(() => track.makeAnnouncement().then(),2000, queue)
})
player.on("onEmpty", queue => {
    queue.textChannel.send("🕳️ | Queue is empty. Use `/play` to add another song").then();
})
/*
setInterval(() => {
    console.log(player.queues.get("697124957834051585")?.getTime();
}, 2000);
 */

client.on("ready", OnReady);

client.on("guildCreate", GuildCreate)

client.on("interactionCreate", InteractionCreated);

client.login(process.env.BOT).then();