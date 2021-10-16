"use strict";
exports.__esModule = true;
exports.selectMenus = exports.buttons = exports.commands = void 0;
var Play_1 = require("./Commands/Music/Play");
var PlayNext_1 = require("./Commands/Music/PlayNext");
var Pause_1 = require("./Commands/Music/Pause");
var Resume_1 = require("./Commands/Music/Resume");
var Loop_1 = require("./Commands/Music/Loop");
var Skip_1 = require("./Commands/Music/Skip");
var Stop_1 = require("./Commands/Music/Stop");
var Rewind_1 = require("./Commands/Music/Rewind");
var NowPlaying_1 = require("./Commands/Music/NowPlaying");
var QueueCommand_1 = require("./Commands/Music/QueueCommand");
var HistoryCommand_1 = require("./Commands/Music/HistoryCommand");
var ClearQueue_1 = require("./Commands/Music/ClearQueue");
var PreviousButton_1 = require("./Buttons/Music/PreviousButton");
var PlayButton_1 = require("./Buttons/Music/PlayButton");
var PauseButton_1 = require("./Buttons/Music/PauseButton");
var SkipButton_1 = require("./Buttons/Music/SkipButton");
var StopButton_1 = require("./Buttons/Music/StopButton");
var QueueButton_1 = require("./Buttons/Music/QueueButton");
var HistoryButton_1 = require("./Buttons/Music/HistoryButton");
var NowPlayingButton_1 = require("./Buttons/Music/NowPlayingButton");
var LoopMenu_1 = require("./SelectMenu/Music/LoopMenu");
var PlayNextButton_1 = require("./Buttons/Music/PlayNextButton");
var PlayLastButton_1 = require("./Buttons/Music/PlayLastButton");
exports.commands = [
    new Play_1["default"](),
    new PlayNext_1["default"](),
    new Pause_1["default"](),
    new Resume_1["default"](),
    new Loop_1["default"](),
    new Skip_1["default"](),
    new Stop_1["default"](),
    new Rewind_1["default"](),
    new NowPlaying_1["default"](),
    new QueueCommand_1["default"](),
    new HistoryCommand_1["default"](),
    new ClearQueue_1["default"]()
];
exports.buttons = [
    new PreviousButton_1["default"](),
    new PlayButton_1["default"](),
    new PauseButton_1["default"](),
    new SkipButton_1["default"](),
    new StopButton_1["default"](),
    new QueueButton_1["default"](),
    new HistoryButton_1["default"](),
    new NowPlayingButton_1["default"](),
    new PlayNextButton_1["default"](),
    new PlayLastButton_1["default"]()
];
exports.selectMenus = [
    new LoopMenu_1["default"]()
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
        var args = interaction.customId.split("-");
        interaction.customId = args.shift();
        for (var _b = 0, buttons_1 = exports.buttons; _b < buttons_1.length; _b++) {
            var button = buttons_1[_b];
            if (button.buttonName === interaction.customId)
                button.execute(interaction, args);
        }
    }
    else if (interaction.isSelectMenu()) {
        for (var _c = 0, selectMenus_1 = exports.selectMenus; _c < selectMenus_1.length; _c++) {
            var selectMenu = selectMenus_1[_c];
            if (selectMenu.selectName === interaction.customId)
                selectMenu.execute(interaction);
        }
    }
}
exports["default"] = default_1;
//# sourceMappingURL=InteractionCreated.js.map