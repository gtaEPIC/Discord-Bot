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
exports.searchErrorReason = exports.LoopModes = void 0;
var Track_1 = require("./Track");
var voice_1 = require("@discordjs/voice");
var ytdl = require("ytdl-core");
var ytSearch = require("yt-search");
var ytlist = require("youtube-search-api");
var Extras_1 = require("../Extras");
var PlayList_1 = require("./PlayList");
var soundcloud_downloader_1 = require("soundcloud-downloader");
var LoopModes;
(function (LoopModes) {
    LoopModes[LoopModes["OFF"] = 0] = "OFF";
    LoopModes[LoopModes["TRACK"] = 1] = "TRACK";
    LoopModes[LoopModes["QUEUE"] = 2] = "QUEUE";
})(LoopModes = exports.LoopModes || (exports.LoopModes = {}));
var searchErrorReason = /** @class */ (function () {
    function searchErrorReason() {
    }
    return searchErrorReason;
}());
exports.searchErrorReason = searchErrorReason;
var Queue = /** @class */ (function () {
    function Queue(player, guild, voice, textChannel) {
        this.connection = null;
        this.songs = [];
        this.history = [];
        //volume: number = 5;
        this.paused = false;
        this.loop = LoopModes.OFF;
        this.player = player;
        this.guild = guild;
        this.voiceChannel = voice;
        if (textChannel)
            this.textChannel = textChannel;
    }
    Queue.prototype.connect = function (newVoice) {
        if (newVoice)
            this.voiceChannel = newVoice;
        this.connection = (0, voice_1.joinVoiceChannel)({
            channelId: this.voiceChannel.id,
            guildId: this.guild.id,
            adapterCreator: this.guild.voiceAdapterCreator
        });
    };
    Queue.prototype.createConnection = function (replied) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 6]);
                        if (!!this.connection) return [3 /*break*/, 3];
                        return [4 /*yield*/, replied.edit("🔈 | Attempting to join channel")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.connect()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [4 /*yield*/, replied.edit({ content: "❌ | An error occurred while attempting to join!" })];
                    case 5:
                        _a.sent();
                        this["delete"]();
                        return [2 /*return*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Queue.prototype.resume = function () {
        this.paused = false;
        this.audioPlayer.unpause();
    };
    Queue.prototype.pause = function () {
        this.paused = true;
        this.audioPlayer.pause();
    };
    Queue.prototype.addTrack = function (track, position) {
        if (position === void 0) { position = -1; }
        if (position < 0)
            this.songs.push(track);
        else if (position === 0)
            this.songs.unshift(track);
        else
            this.songs.splice(position, 0, track);
    };
    Queue.prototype.play = function (track) {
        this.addTrack(track);
        //if (this.paused) this.resume()
        if (!this.playing)
            this.next().then();
    };
    Queue.prototype.stateChange = function (oldState, newState) {
        var _this = this;
        var track = this.playing;
        //console.log("Time Check: ", Math.floor(oldState["playbackDuration"] / 1000), track.duration - 5)
        console.log("STATE CHANGE", oldState, newState, track);
        if (newState.status === voice_1.AudioPlayerStatus.Idle && oldState.status !== voice_1.AudioPlayerStatus.Buffering && Math.floor(oldState["playbackDuration"] / 1000) >= track.duration - 1)
            this.onEnd().then();
        else if (newState.status === voice_1.AudioPlayerStatus.Idle)
            track.error({ message: "Feed Stopped" }).then();
        else if (newState.status === voice_1.AudioPlayerStatus.AutoPaused)
            setTimeout(function () { var _a; return (_a = _this.audioPlayer) === null || _a === void 0 ? void 0 : _a.unpause(); }, 2000);
    };
    Queue.prototype.createStateCheck = function () {
        var _this = this;
        this.audioPlayer.on("stateChange", function (oldState, newState) { return _this.stateChange(oldState, newState); });
    };
    Queue.prototype.next = function () {
        return __awaiter(this, void 0, void 0, function () {
            var track;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.playing = this.songs.shift();
                        if (!this.playing) {
                            this.onEmpty();
                            return [2 /*return*/];
                        }
                        track = this.playing;
                        return [4 /*yield*/, track.play(0)];
                    case 1:
                        _a.sent();
                        this.player.onStart(this, track);
                        return [2 /*return*/];
                }
            });
        });
    };
    Queue.prototype.getTime = function () {
        if (this.audioPlayer) {
            if (this.audioPlayer.state["playbackDuration"])
                return Math.floor(this.audioPlayer.state["playbackDuration"] / 1000);
            else
                return -1;
        }
        return -1;
    };
    Queue.prototype.updateHistory = function (track) {
        this.history.unshift(track);
        if (this.history.length > 5) {
            this.history.splice(this.history.length, 1);
        }
    };
    Queue.prototype.skip = function () {
        this.audioPlayer.stop();
    };
    Queue.prototype.stop = function () {
        var _a;
        this.songs = [];
        this.audioPlayer.stop(true);
        this.audioPlayer = null;
        (_a = this.playing) === null || _a === void 0 ? void 0 : _a.onEnd();
        this.playing = null;
        this.connection.disconnect();
        this.connection = null;
    };
    Queue.prototype.rewind = function () {
        var _a;
        if (this.history.length < 1)
            return false;
        if (this.playing) {
            this.playing.attempts = 0;
            this.addTrack(this.playing, 1);
        }
        this.addTrack(this.history.shift(), 1);
        (_a = this.playing) === null || _a === void 0 ? void 0 : _a.onEnd();
        this.next().then();
        //this.skip();
        return true;
    };
    Queue.prototype.getProgressBar = function (size, includeTimes) {
        //size--;
        var dot = Math.floor(this.getTime() / this.playing.duration * size);
        var final = "**|";
        for (var i = 0; i < size; i++) {
            if (i <= dot)
                final += "🔸";
            else
                final += "🔹";
        }
        final += "|** ";
        if (this.getTime() === -1)
            includeTimes = false;
        if (includeTimes)
            final += (0, Extras_1.secondsToTime)(this.getTime()) + "/" + (0, Extras_1.secondsToTime)(this.playing.duration);
        return final;
    };
    Queue.prototype.onEnd = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.player.onEnd)
                            this.player.onEnd(this, this.playing);
                        this.playing.attempts = 0;
                        if (this.loop === LoopModes.TRACK)
                            this.addTrack(this.playing, 1);
                        if (this.loop === LoopModes.QUEUE)
                            this.addTrack(this.playing);
                        this.updateHistory(this.playing);
                        this.playing.onEnd();
                        this.playing = null;
                        return [4 /*yield*/, this.next()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Queue.prototype.onEmpty = function () {
        if (this.player.onEmpty)
            this.player.onEmpty(this);
    };
    Queue.prototype.search = function (request, member, message) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response, id, args, _i, args_1, arg, response, playlist, count, emojiState, lastUpdate, _b, _c, track, emoji, details, response, response, e_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 15, , 16]);
                        if (!!request.startsWith("http")) return [3 /*break*/, 2];
                        return [4 /*yield*/, ytSearch(request)];
                    case 1:
                        response = _d.sent();
                        if (!((_a = response === null || response === void 0 ? void 0 : response.all) === null || _a === void 0 ? void 0 : _a.length))
                            return [2 /*return*/, { reason: "No Results Found" }];
                        request = response.all[0].url;
                        _d.label = 2;
                    case 2:
                        if (!(request.includes("youtube") || request.includes("youtu.be"))) return [3 /*break*/, 11];
                        if (!request.includes("list")) return [3 /*break*/, 8];
                        id = "";
                        args = request.split("?")[1].split("&");
                        for (_i = 0, args_1 = args; _i < args_1.length; _i++) {
                            arg = args_1[_i];
                            if (arg.startsWith("list"))
                                id = arg.split("=")[1];
                        }
                        return [4 /*yield*/, ytlist.GetPlaylistData(id)];
                    case 3:
                        response = _d.sent();
                        console.log(response);
                        playlist = new PlayList_1["default"]();
                        playlist.name = response.metadata.playlistMetadataRenderer.title;
                        count = 0;
                        emojiState = false;
                        lastUpdate = 0;
                        _b = 0, _c = response.items;
                        _d.label = 4;
                    case 4:
                        if (!(_b < _c.length)) return [3 /*break*/, 7];
                        track = _c[_b];
                        count++;
                        if (lastUpdate + 5000 < Date.now()) {
                            emoji = "⏳";
                            if (emojiState)
                                emoji = "⌛";
                            emojiState = !emojiState;
                            message === null || message === void 0 ? void 0 : message.edit({ content: emoji + " | Adding songs to queue (" + count + "/" + response.items.length + ")" });
                            lastUpdate = Date.now();
                        }
                        return [4 /*yield*/, ytdl.getInfo("https://www.youtube.com/watch?v=" + track.id)];
                    case 5:
                        details = _d.sent();
                        playlist.tracks.push(new Track_1["default"](details.videoDetails.title, details.videoDetails.author.name, details.videoDetails.video_url, details.videoDetails.video_url, member, parseInt(details.videoDetails.lengthSeconds), "youtube", this));
                        _d.label = 6;
                    case 6:
                        _b++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, playlist];
                    case 8: return [4 /*yield*/, ytdl.getInfo(request)];
                    case 9:
                        response = _d.sent();
                        console.log(response.videoDetails.lengthSeconds);
                        return [2 /*return*/, new Track_1["default"](response.videoDetails.title, response.videoDetails.author.name, response.videoDetails.video_url, response.videoDetails.video_url, member, parseInt(response.videoDetails.lengthSeconds), "youtube", this)];
                    case 10: return [3 /*break*/, 14];
                    case 11:
                        if (!(request.includes("soundcloud") && soundcloud_downloader_1["default"].isValidUrl(request))) return [3 /*break*/, 13];
                        return [4 /*yield*/, soundcloud_downloader_1["default"].getInfo(request)];
                    case 12:
                        response = _d.sent();
                        console.log(response);
                        return [2 /*return*/, new Track_1["default"](response.title, response.user.username, request, response.uri, member, Math.floor(response.duration / 1000), "soundcloud", this)];
                    case 13: return [2 /*return*/, { reason: "Unsupported source" }];
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        e_2 = _d.sent();
                        console.error(e_2);
                        return [2 /*return*/, null];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    Queue.prototype["delete"] = function () {
        this.player.queues["delete"](this.guild.id);
    };
    return Queue;
}());
exports["default"] = Queue;
//# sourceMappingURL=Queue.js.map