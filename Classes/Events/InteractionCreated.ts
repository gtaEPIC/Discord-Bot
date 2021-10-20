import {Interaction} from "discord.js";
import Commands from "./Commands/Commands";
import Play from "./Commands/Music/Play";
import PlayNext from "./Commands/Music/PlayNext";
import Pause from "./Commands/Music/Pause";
import Resume from "./Commands/Music/Resume";
import Loop from "./Commands/Music/Loop";
import Skip from "./Commands/Music/Skip";
import Stop from "./Commands/Music/Stop";
import Rewind from "./Commands/Music/Rewind";
import NowPlaying from "./Commands/Music/NowPlaying";
import QueueCommand from "./Commands/Music/QueueCommand";
import HistoryCommand from "./Commands/Music/HistoryCommand";
import ClearQueue from "./Commands/Music/ClearQueue";
import Buttons from "./Buttons/Buttons";
import PreviousButton from "./Buttons/Music/PreviousButton";
import PlayButton from "./Buttons/Music/PlayButton";
import PauseButton from "./Buttons/Music/PauseButton";
import SkipButton from "./Buttons/Music/SkipButton";
import StopButton from "./Buttons/Music/StopButton";
import QueueButton from "./Buttons/Music/QueueButton";
import HistoryButton from "./Buttons/Music/HistoryButton";
import NowPlayingButton from "./Buttons/Music/NowPlayingButton";
import SelectMenu from "./SelectMenu/SelectMenu";
import LoopMenu from "./SelectMenu/Music/LoopMenu";
import PlayNextButton from "./Buttons/Music/PlayNextButton";
import PlayLastButton from "./Buttons/Music/PlayLastButton";

export const commands: Array<Commands> = [
    new Play(),
    new PlayNext(),
    new Pause(),
    new Resume(),
    new Loop(),
    new Skip(),
    new Stop(),
    new Rewind(),
    new NowPlaying(),
    new QueueCommand(),
    new HistoryCommand(),
    new ClearQueue()
];
export const buttons: Array<Buttons> = [
    new PreviousButton(),
    new PlayButton(),
    new PauseButton(),
    new SkipButton(),
    new StopButton(),
    new QueueButton(),
    new HistoryButton(),
    new NowPlayingButton(),
    new PlayNextButton(),
    new PlayLastButton()
]
export const selectMenus: Array<SelectMenu> = [
    new LoopMenu()
]

export default function (interaction: Interaction) {

    if (interaction.isCommand()) {
        const args = {}
        let options = interaction.options.data
        if (options.length > 0) {
            for (let option of options) {
                args[option.name] = option.value
            }
        }
        for (let command of commands) {
            if (command.commandName === interaction.commandName) command.execute(interaction, args);
        }
    }else if (interaction.isButton()) {
        let args = interaction.customId.split("-");
        interaction.customId = args.shift();
        for (let button of buttons) {
            if (button.buttonName === interaction.customId) button.execute(interaction, args);
        }
    }else if (interaction.isSelectMenu()) {
        for (let selectMenu of selectMenus) {
            if (selectMenu.selectName === interaction.customId) selectMenu.execute(interaction);
        }
    }else if (interaction.isContextMenu()) {

    }
}