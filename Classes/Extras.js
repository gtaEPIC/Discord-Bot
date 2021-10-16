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
exports.secondsToTime = exports.timeToSeconds = exports.toDoubleDigits = exports.checkVC = exports.fullCheck = exports.vcCheck = exports.createCommands = void 0;
var rest_1 = require("@discordjs/rest");
var v9_1 = require("discord-api-types/v9");
var index_1 = require("../index");
var InteractionCreated_1 = require("./Events/InteractionCreated");
require("dotenv").config();
function createCommands(guild) {
    return __awaiter(this, void 0, void 0, function () {
        var cmd, botID, CLIENT_ID, rest, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cmd = InteractionCreated_1.commands.map(function (command) { return command.createCommand(); });
                    botID = process.env.BOT;
                    CLIENT_ID = index_1.client.user.id;
                    rest = new rest_1.REST({
                        version: '9'
                    }).setToken(botID);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!!guild.id) return [3 /*break*/, 3];
                    return [4 /*yield*/, rest.put(v9_1.Routes.applicationCommands(CLIENT_ID), {
                            body: cmd
                        })];
                case 2:
                    _a.sent();
                    console.log('Successfully registered application commands globally');
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, rest.put(v9_1.Routes.applicationGuildCommands(CLIENT_ID, guild.id), {
                        body: cmd
                    })];
                case 4:
                    _a.sent();
                    console.log('Successfully registered application commands for development guild');
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    if (error_1)
                        console.error(error_1);
                    return [2 /*return*/, false];
                case 7: return [2 /*return*/, true];
            }
        });
    });
}
exports.createCommands = createCommands;
function vcCheck(myVC, userVC, interaction) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!myVC) return [3 /*break*/, 6];
                    if (!userVC) return [3 /*break*/, 3];
                    if (!(userVC !== myVC)) return [3 /*break*/, 2];
                    return [4 /*yield*/, interaction.reply({ content: "I'm already in <#" + myVC + ">", ephemeral: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2: return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, interaction.reply({
                        content: "You aren't in a vc. But you can join me in <#" + myVC + ">",
                        ephemeral: true
                    })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, true];
                case 5: return [3 /*break*/, 8];
                case 6:
                    if (!!userVC) return [3 /*break*/, 8];
                    return [4 /*yield*/, interaction.reply({ content: "Whoops join a vc first. I'm free :D", ephemeral: true })];
                case 7:
                    _a.sent();
                    return [2 /*return*/, true];
                case 8: 
                //console.log("No Vc Check")
                return [2 /*return*/, false];
            }
        });
    });
}
exports.vcCheck = vcCheck;
function fullCheck(interaction, member) {
    return __awaiter(this, void 0, void 0, function () {
        var myVC, userVC, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    myVC = interaction.guild.me.voice.channelId;
                    userVC = member.voice.channelId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, vcCheck(myVC, userVC, interaction)];
                case 2:
                    if (_a.sent())
                        return [2 /*return*/, true];
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [4 /*yield*/, interaction.reply({ content: "Whoops, an error occurred. (E5002)", ephemeral: true })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, true];
                case 5: 
                //console.log("All Good Check")
                return [2 /*return*/, false];
            }
        });
    });
}
exports.fullCheck = fullCheck;
function checkVC(interaction) {
    return __awaiter(this, void 0, void 0, function () {
        var member, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 1, , 3]);
                    member = interaction.member;
                    return [3 /*break*/, 3];
                case 1:
                    e_2 = _a.sent();
                    return [4 /*yield*/, interaction.reply({ content: "Whoops, an error Occurred. (E5001)", ephemeral: true })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, fullCheck(interaction, member)];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.checkVC = checkVC;
/**
 * Converts a number to double digits in a String
 * @param number The number to be formatted
 */
function toDoubleDigits(number) {
    if (number < 10) {
        return "0" + number;
    }
    else {
        return number.toString();
    }
}
exports.toDoubleDigits = toDoubleDigits;
function timeToSeconds(time) {
    var mins = time.split(":")[0];
    var secs = time.split(":")[1];
    var seconds = parseInt(secs);
    seconds += parseInt(mins) * 60;
    return seconds;
}
exports.timeToSeconds = timeToSeconds;
function secondsToTime(seconds) {
    var mins = Math.floor(seconds / 60);
    seconds -= mins * 60;
    return mins + ":" + toDoubleDigits(seconds);
}
exports.secondsToTime = secondsToTime;
//# sourceMappingURL=Extras.js.map