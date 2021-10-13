"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.client = void 0;
var discord_js_1 = require("discord.js");
var OnReady_1 = require("./Classes/Events/OnReady");
require("dotenv").config();
var GuildCreate_1 = require("./Classes/Events/GuildCreate");
var InteractionCreated_1 = require("./Classes/Events/InteractionCreated");
var distube_1 = require("distube");
exports.client = new discord_js_1.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES
    ]
});
exports.player = new distube_1.DisTube(exports.client, {
    searchSongs: 1,
    searchCooldown: 30,
    leaveOnEmpty: false,
    emptyCooldown: 0,
    leaveOnFinish: false,
    leaveOnStop: true,
});
function timeToSeconds(time) {
    var mins = time.split(":")[0];
    var secs = time.split(":")[1];
    var seconds = parseInt(secs);
    seconds += parseInt(mins) * 60;
    return seconds;
}
exports.player.on("playSong", function (queue, track) {
    queue.textChannel.send("\uD83C\uDFB6 | Now playing **" + track.name + "**!").then();
});
exports.client.on("ready", OnReady_1.default);
exports.client.on("guildCreate", GuildCreate_1.default);
exports.client.on("interactionCreate", InteractionCreated_1.default);
exports.client.login(process.env.BOT).then();
