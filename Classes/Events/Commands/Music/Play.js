"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.addSong = void 0;
var Commands_1 = require("../Commands");
var discord_js_1 = require("discord.js");
var index_1 = require("../../../../index");
var builders_1 = require("@discordjs/builders");
var Extras_1 = require("../../../Extras");
var Queue_1 = require("../../../Music/Queue");
var PlayList_1 = require("../../../Music/PlayList");
var SQLMusicChannel_1 = require("../../../SQL/SQLMusicChannel");
function addSong(queue, query, member, replied, next) {
    return __awaiter(this, void 0, void 0, function () {
        var results, embed, button, counts, _i, _a, track;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, queue.search(query, member, replied)];
                case 1:
                    results = _b.sent();
                    if (!!results) return [3 /*break*/, 3];
                    return [4 /*yield*/, replied.edit({ content: "\u274C | Track **" + query + "** not found!" })];
                case 2: return [2 /*return*/, _b.sent()];
                case 3:
                    if (!(results instanceof Queue_1.searchErrorReason)) return [3 /*break*/, 5];
                    return [4 /*yield*/, replied.edit({ content: "\u274C | A problem occurred trying to get **" + query + "**!\nReason: " + results.reason })];
                case 4: return [2 /*return*/, _b.sent()];
                case 5: return [4 /*yield*/, queue.createConnection(replied)];
                case 6:
                    _b.sent();
                    if (!(results instanceof PlayList_1["default"])) return [3 /*break*/, 8];
                    embed = new discord_js_1.MessageEmbed()
                        .setTitle("Queued a Playlist")
                        .setDescription("Playlist: [" + results.name + "](https://www.youtube.com/playlist?list=" + results.id + ")\n" +
                        "Tracks that were added:");
                    button = new discord_js_1.MessageButton()
                        .setLabel("Show Queue")
                        .setStyle(1 /* PRIMARY */)
                        .setCustomId("queue");
                    counts = 0;
                    for (_i = 0, _a = results.tracks; _i < _a.length; _i++) {
                        track = _a[_i];
                        counts++;
                        if (next)
                            queue.addTrack(track, counts - 1);
                        else
                            queue.addTrack(track);
                        if (counts <= 5)
                            embed.addField(track.name + " (" + (0, Extras_1.secondsToTime)(track.duration) + ")", "Author: " + track.author + "\n" +
                                "[Link](" + track.url + ")");
                    }
                    counts -= 5;
                    if (counts > 0)
                        embed.addField("Plus " + counts + " more", "Click the Show Queue button or use the `/queue` command to see all the songs");
                    if (!queue.playing)
                        queue.next().then();
                    return [4 /*yield*/, replied.edit({
                            content: "✅ | Finished" + (next ? " songs were added to play next" : ""),
                            embeds: [embed],
                            components: [new discord_js_1.MessageActionRow({ components: [button] })]
                        })];
                case 7: return [2 /*return*/, _b.sent()];
                case 8:
                    queue.play(results);
                    return [4 /*yield*/, replied.edit({ content: "\u23F1 | Queued track **" + results.name + "**" + (next ? " and will play next" : "") + "!" })];
                case 9: 
                //if (!queue.playing || !queue.paused) await queue.resume();
                return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.addSong = addSong;
var Play = /** @class */ (function (_super) {
    __extends(Play, _super);
    function Play() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.commandName = "play";
        return _this;
    }
    Play.prototype.execute = function (interaction, args) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, member, e_1, queue, replied, query;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, (0, Extras_1.checkMusicChannel)(interaction.guild, interaction.channel.id)];
                    case 1:
                        if (!!(_e.sent())) return [3 /*break*/, 3];
                        _b = (_a = interaction).reply;
                        _d = {};
                        _c = "❌ | Sorry, please use this command in <#";
                        return [4 /*yield*/, SQLMusicChannel_1["default"].getMusicChannel(interaction.guild)];
                    case 2: return [2 /*return*/, _b.apply(_a, [(_d.content = _c +
                                (_e.sent()).id + ">", _d.ephemeral = true, _d)])];
                    case 3: return [4 /*yield*/, (0, Extras_1.checkVC)(interaction)];
                    case 4:
                        if (_e.sent())
                            return [2 /*return*/];
                        _e.label = 5;
                    case 5:
                        _e.trys.push([5, 6, , 8]);
                        member = interaction.member;
                        return [3 /*break*/, 8];
                    case 6:
                        e_1 = _e.sent();
                        return [4 /*yield*/, interaction.reply({ content: "Whoops, an error Occurred. (E5001)", ephemeral: true })];
                    case 7:
                        _e.sent();
                        return [2 /*return*/];
                    case 8:
                        queue = index_1.player.createQueue(interaction.guild, member.voice.channel, interaction.channel);
                        return [4 /*yield*/, interaction.reply({ content: "🔍 | Searching for song", fetchReply: true })];
                    case 9:
                        replied = (_e.sent());
                        query = args["query"];
                        return [4 /*yield*/, addSong(queue, query, member, replied, false)];
                    case 10:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Play.prototype.createCommand = function () {
        return new builders_1.SlashCommandBuilder()
            .setName("play")
            .setDescription("Play / Add a song to the queue for the bot to play")
            .addStringOption(new builders_1.SlashCommandStringOption().setName("query").setDescription("Link to audio source").setRequired(true))
            .toJSON();
    };
    return Play;
}(Commands_1["default"]));
exports["default"] = Play;
//# sourceMappingURL=Play.js.map