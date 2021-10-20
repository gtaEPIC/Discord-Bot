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
exports.LoopModes = void 0;
var Track_1 = require("./Track");
var voice_1 = require("@discordjs/voice");
var ytdl = require("ytdl-core");
var ytSearch = require("yt-search");
var Extras_1 = require("../Extras");
var LoopModes;
(function (LoopModes) {
    LoopModes[LoopModes["OFF"] = 0] = "OFF";
    LoopModes[LoopModes["TRACK"] = 1] = "TRACK";
    LoopModes[LoopModes["QUEUE"] = 2] = "QUEUE";
})(LoopModes = exports.LoopModes || (exports.LoopModes = {}));
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
        else
            this.songs.unshift(track);
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
        if (newState.status === voice_1.AudioPlayerStatus.Idle && oldState.status !== voice_1.AudioPlayerStatus.Buffering && Math.floor(oldState["playbackDuration"] / 1000) <= track.duration - 1)
            this.onEnd().then();
        else if (newState.status === voice_1.AudioPlayerStatus.Idle)
            track.error({ message: "Feed Stopped" }).then();
        else if (newState.status === voice_1.AudioPlayerStatus.AutoPaused)
            setTimeout(function () { return _this.audioPlayer.unpause(); }, 2000);
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
        this.songs = [];
        this.audioPlayer.stop();
        this.connection.disconnect();
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
    Queue.prototype.search = function (request, member) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response_1, response, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        if (!!request.startsWith("http")) return [3 /*break*/, 2];
                        return [4 /*yield*/, ytSearch(request)];
                    case 1:
                        response_1 = _b.sent();
                        if (!((_a = response_1 === null || response_1 === void 0 ? void 0 : response_1.all) === null || _a === void 0 ? void 0 : _a.length))
                            return [2 /*return*/, null];
                        request = response_1.all[0].url;
                        _b.label = 2;
                    case 2: return [4 /*yield*/, ytdl.getInfo(request)];
                    case 3:
                        response = _b.sent();
                        console.log(response.videoDetails.lengthSeconds);
                        return [2 /*return*/, new Track_1["default"](response.videoDetails.title, response.videoDetails.author.name, response.videoDetails.video_url, member, parseInt(response.videoDetails.lengthSeconds), "youtube", this)];
                    case 4:
                        e_1 = _b.sent();
                        console.log(e_1);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
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