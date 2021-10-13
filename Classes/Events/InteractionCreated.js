"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
var Play_1 = require("./Commands/Music/Play");
var PlayNext_1 = require("./Commands/Music/PlayNext");
var Pause_1 = require("./Commands/Music/Pause");
var Resume_1 = require("./Commands/Music/Resume");
var Loop_1 = require("./Commands/Music/Loop");
exports.commands = [
    new Play_1.default(),
    new PlayNext_1.default(),
    new Pause_1.default(),
    new Resume_1.default(),
    new Loop_1.default()
];
function default_1(interaction) {
    if (interaction.isCommand()) {
        var args = {};
        var options = interaction.options.data;
        if (options.length > 0) {
            for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
                var option = options_1[_i];
                args[option.name] = option.value;
            }
        }
        for (var _a = 0, commands_1 = exports.commands; _a < commands_1.length; _a++) {
            var command = commands_1[_a];
            if (command.commandName === interaction.commandName)
                command.execute(interaction, args);
        }
    }
    else if (interaction.isButton()) {
    }
    else if (interaction.isSelectMenu()) {
    }
}
exports.default = default_1;
