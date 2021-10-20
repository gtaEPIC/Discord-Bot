"use strict";
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
var discord_js_1 = require("discord.js");
var voice_1 = require("@discordjs/voice");
var Queue_1 = require("./Queue");
var ytdl = require("ytdl-core");
var Track = /** @class */ (function () {
    function Track(name, author, url, requested, duration, type, queue) {
        this.attempts = 0;
        this.maxAttempts = 3;
        this.name = name;
        this.author = author;
        this.url = url;
        this.requested = requested;
        this.duration = duration;
        this.type = type;
        this.queue = queue;
    }
    Track.prototype.initSource = function (source, onError) {
        this.source = source;
        this.resource = (0, voice_1.createAudioResource)(this.source);
        this.source.addListener("close", function () { return console.log("YTDL Closed"); });
        this.source.addListener("error", function (err) { return console.error("YTDL ERROR:", err); });
        this.source.addListener("error", (function (err) { return onError(err); }));
        this.source.addListener("pause", function () { return console.log("YTDL Paused"); });
        this.source.addListener("data", function () { return console.log("YTDL Data"); });
        //this.source.addListener("readable", () => console.log("YTDL Readable"));
        this.source.addListener("end", function () { return console.log("YTDL End"); });
        this.source.addListener("resume", function () { return console.log("YTDL Resume"); });
    };
    Track.prototype.makeAnnouncement = function () {
        return __awaiter(this, void 0, void 0, function () {
            var prevButton, playPauseButton, stopButton, nextButton, placeholder, loopSelection, changedState, actionRow, actionRow2, track, first, message, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        prevButton = new discord_js_1.MessageButton()
                            .setStyle(2 /* SECONDARY */)
                            .setLabel("⏮ Previous Track")
                            .setCustomId("previous")
                            .setDisabled(this.queue.history.length === 0);
                        playPauseButton = new discord_js_1.MessageButton()
                            .setStyle(1 /* PRIMARY */)
                            .setLabel("⏯ | " + (this.queue.paused ? "Play" : "Pause"))
                            .setCustomId((this.queue.paused ? "play" : "pause"));
                        stopButton = new discord_js_1.MessageButton()
                            .setStyle(4 /* DANGER */)
                            .setLabel("⏹ | Stop")
                            .setCustomId("stop");
                        nextButton = new discord_js_1.MessageButton()
                            .setStyle(2 /* SECONDARY */)
                            .setLabel("⏭ | " + (this.queue.songs.length > 0 ? "Next Track" : "Skip"))
                            .setCustomId("skip");
                        placeholder = void 0;
                        switch (this.queue.loop) {
                            case Queue_1.LoopModes.OFF:
                                placeholder = "Loop Off";
                                break;
                            case Queue_1.LoopModes.TRACK:
                                placeholder = "Loop Song";
                                break;
                            case Queue_1.LoopModes.QUEUE:
                                placeholder = "Loop Queue";
                                break;
                            default:
                                placeholder = "Loop Off";
                                break;
                        }
                        loopSelection = new discord_js_1.MessageSelectMenu()
                            .setCustomId("loop")
                            .addOptions([
                            {
                                label: "Loop Off",
                                value: "off",
                                description: "Current song won't loop",
                                "default": this.queue.loop === Queue_1.LoopModes.OFF
                            },
                            {
                                label: "Loop Song",
                                value: "song",
                                description: "Loops the current song",
                                "default": this.queue.loop === Queue_1.LoopModes.TRACK
                            },
                            {
                                label: "Loop Queue",
                                value: "queue",
                                description: "Loops the entire queue",
                                "default": this.queue.loop === Queue_1.LoopModes.QUEUE
                            }
                        ])
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setPlaceholder(placeholder);
                        changedState = this.queue.statedLoop !== this.queue.loop || this.queue.statedPause !== this.queue.paused;
                        this.queue.statedLoop = this.queue.loop;
                        this.queue.statedPause = this.queue.paused;
                        actionRow = new discord_js_1.MessageActionRow({ components: [prevButton, playPauseButton, stopButton, nextButton] });
                        actionRow2 = new discord_js_1.MessageActionRow({ components: [loopSelection] });
                        track = this.queue.playing;
                        first = this.announcement === undefined;
                        message = (!this.queue.paused ? "🎶 | Now playing" : "⏸ | Paused on") + (" **" + track.name + "**!\n" + this.queue.getProgressBar(20, !first));
                        if (this.attempts > 1) {
                            message += "\n⚠ | An issue occurred trying to play the audio. Trying again. (Attempt " + track.attempts + "/" + this.maxAttempts + ")";
                        }
                        if (!first) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.queue.textChannel.send({
                                content: message,
                                components: [actionRow, actionRow2]
                            })];
                    case 1:
                        _a.announcement = _b.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!changedState) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.announcement.edit({
                                content: message,
                                components: [actionRow, actionRow2]
                            })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.announcement.edit({
                            content: message
                        })];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        e_1 = _b.sent();
                        console.error(e_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Track.prototype.onEnd = function () {
        var _a;
        (_a = this.announcement) === null || _a === void 0 ? void 0 : _a["delete"]().then();
        this.announcement = undefined;
        clearInterval(this.updater);
    };
    Track.prototype.play = function (point) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.attempts++;
                        _a = this.initSource;
                        return [4 /*yield*/, ytdl(this.url, {
                                filter: "audio",
                                quality: "lowestaudio",
                                begin: point,
                                highWaterMark: 1 << 25
                            })];
                    case 1:
                        _a.apply(this, [_b.sent(), function (err1) { return _this.error(err1); }]);
                        if (!this.queue.audioPlayer) {
                            this.queue.audioPlayer = this.queue.connection.subscribe((0, voice_1.createAudioPlayer)({
                                debug: true
                            })).player;
                            this.queue.createStateCheck();
                            this.queue.audioPlayer.on("error", function (error) { return console.error("AUDIO PLAYER ERROR:", error); });
                        }
                        this.queue.audioPlayer.play(this.resource);
                        return [2 /*return*/];
                }
            });
        });
    };
    Track.prototype.error = function (err) {
        return __awaiter(this, void 0, void 0, function () {
            var point, playNextButton, playLastButton, actionRow, details, contents, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.lastError >= Math.floor(Date.now() / 1000) - 5)
                            return [2 /*return*/];
                        this.lastError = Math.floor(Date.now() / 1000);
                        console.error("Track ERROR was thrown:", err);
                        console.log("Track:", this);
                        point = this.resource.playbackDuration - 1000;
                        if (point < 0)
                            point = 0;
                        if (!(this.attempts >= this.maxAttempts)) return [3 /*break*/, 2];
                        playNextButton = new discord_js_1.MessageButton()
                            .setStyle(1 /* PRIMARY */)
                            .setLabel("Play Next")
                            .setCustomId("playnext-" + this.url);
                        playLastButton = new discord_js_1.MessageButton()
                            .setStyle(2 /* SECONDARY */)
                            .setLabel("Add to queue")
                            .setCustomId("playlast-" + this.url);
                        actionRow = new discord_js_1.MessageActionRow({ components: [playNextButton, playLastButton] });
                        details = new discord_js_1.MessageEmbed()
                            .setTitle("Error Details")
                            .setDescription("The song in the queue failed to play due to an error")
                            .addField("Message", err.message)
                            .addField("Song", "[" + this.name + "](" + this.url + ")")
                            .addField("Requested by", "<@" + this.requested.id + ">");
                        contents = {
                            content: "❌ | An error occurred while playing the song. Attempts: " + this.attempts + "/" + this.maxAttempts,
                            embeds: [details],
                            components: [actionRow]
                        };
                        return [4 /*yield*/, this.queue.textChannel.send(contents)];
                    case 1:
                        _a.sent();
                        this.queue.onEnd().then();
                        return [3 /*break*/, 6];
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        //clearInterval(this.updater);
                        //let message: string = "⚠ | An issue occurred trying to play the audio. Trying again. (Attempt " + track.attempts + "/" + maxAttempts + ")";
                        //await this.textChannel.send(message);
                        return [4 /*yield*/, this.play(point)];
                    case 3:
                        //clearInterval(this.updater);
                        //let message: string = "⚠ | An issue occurred trying to play the audio. Trying again. (Attempt " + track.attempts + "/" + maxAttempts + ")";
                        //await this.textChannel.send(message);
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        e_2 = _a.sent();
                        console.log("The ERROR caused an ERROR" + e_2);
                        return [4 /*yield*/, this.error(err)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return Track;
}());
exports["default"] = Track;
//# sourceMappingURL=Track.js.map