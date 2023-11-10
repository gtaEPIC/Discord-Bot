"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.client = void 0;
var discord_js_1 = require("discord.js");
var OnReady_1 = require("./Classes/Events/OnReady");
var GuildCreate_1 = require("./Classes/Events/GuildCreate");
var InteractionCreated_1 = require("./Classes/Events/InteractionCreated");
var Player_1 = require("./Classes/Music/Player");
var database_1 = require("./Classes/Events/database");
require("dotenv").config();
exports.client = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.GuildModeration,
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.DirectMessages,
        discord_js_1.IntentsBitField.Flags.GuildMessageReactions,
        discord_js_1.IntentsBitField.Flags.GuildMessageTyping,
        discord_js_1.IntentsBitField.Flags.GuildPresences,
        discord_js_1.IntentsBitField.Flags.GuildVoiceStates,
        discord_js_1.IntentsBitField.Flags.GuildWebhooks,
    ]
});
// SQLSetup(dbFile).then();
(0, database_1.default)();
exports.player = new Player_1.default(exports.client);
exports.player.on("onStart", function (queue, track) {
    track.makeAnnouncement().then();
    track.updater = setInterval(function () { return track.makeAnnouncement().then(); }, 2000, queue);
});
exports.player.on("onEmpty", function (queue) {
    queue.textChannel.send("🕳️ | Queue is empty. Use `/play` to add another song").then();
});
/*
setInterval(() => {
    console.log(player.queues.get("697124957834051585")?.getTime();
}, 2000);
 */
exports.client.on("ready", OnReady_1.default);
exports.client.on("guildCreate", GuildCreate_1.default);
exports.client.on("interactionCreate", InteractionCreated_1.default);
exports.client.login(process.env.BOT).then();
//# sourceMappingURL=index.js.map