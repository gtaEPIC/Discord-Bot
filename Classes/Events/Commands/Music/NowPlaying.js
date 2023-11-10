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
var Commands_1 = require("../Commands");
var discord_js_1 = require("discord.js");
var builders_1 = require("@discordjs/builders");
var index_1 = require("../../../../index");
var NowPlaying = /** @class */ (function (_super) {
    __extends(NowPlaying, _super);
    function NowPlaying() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.commandName = "now-playing";
        return _this;
    }
    NowPlaying.prototype.getEmbed = function (interaction) {
        var member = interaction.member;
        var queue = index_1.player.createQueue(interaction.guild, member.voice.channel, interaction.channel);
        var track = queue.playing;
        var embed;
        if (track) {
            embed = new discord_js_1.EmbedBuilder()
                .setTitle("Now Playing:")
                .setDescription("**[" + track.name + "](" + track.url + ")**")
                .addFields({ name: "Author", value: track.author, inline: true }, { name: "Progress", value: queue.getProgressBar(10, true), inline: true })
                .setFooter({
                text: "Requested by " + track.requested.user.username,
                iconURL: track.requested.displayAvatarURL()
            });
        }
        else {
            embed = new discord_js_1.EmbedBuilder()
                .setTitle("Nothing is playing")
                .setDescription("Use the `/play` command to add a song");
        }
        return embed;
    };
    NowPlaying.prototype.execute = function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var embed, refreshButton, actionRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        embed = this.getEmbed(interaction);
                        refreshButton = new discord_js_1.ButtonBuilder()
                            .setStyle(discord_js_1.ButtonStyle.Primary)
                            .setLabel("🔄 | Refresh")
                            .setCustomId("nowplaying");
                        actionRow = new discord_js_1.ActionRowBuilder({ components: [refreshButton] });
                        return [4 /*yield*/, interaction.reply({
                                embeds: [embed],
                                components: [actionRow]
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NowPlaying.prototype.createCommand = function () {
        return new builders_1.SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Shows information about the current track");
    };
    return NowPlaying;
}(Commands_1["default"]));
exports["default"] = NowPlaying;
//# sourceMappingURL=NowPlaying.js.map