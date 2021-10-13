import {Interaction} from "discord.js";
import Commands from "./Commands/Commands";
import Play from "./Commands/Music/Play";
import PlayNext from "./Commands/Music/PlayNext";
import Pause from "./Commands/Music/Pause";
import Resume from "./Commands/Music/Resume";
import Loop from "./Commands/Music/Loop";

export const commands: Array<Commands> = [
    new Play(),
    new PlayNext(),
    new Pause(),
    new Resume(),
    new Loop()
];

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

    }else if (interaction.isSelectMenu()) {

    }
}