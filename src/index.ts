import {Client, IntentsBitField} from "discord.js";
import OnReady from "./Classes/Events/OnReady";
import GuildCreate from "./Classes/Events/GuildCreate";
import InteractionCreated from "./Classes/Events/InteractionCreated";
import Player from "./Classes/Music/Player";
import setup from "./Classes/Events/database";

require("dotenv").config();

export const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildWebhooks,
    ]
})

// SQLSetup(dbFile).then();
setup();

export const player = new Player(client)

player.on("onStart", (queue, track) => {
    track.makeAnnouncement().then();
    track.updater = setInterval(() => track.makeAnnouncement().then(),5000, queue)
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