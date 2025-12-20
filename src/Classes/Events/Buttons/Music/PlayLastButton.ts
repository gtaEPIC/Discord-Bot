import Buttons from "../Buttons";
import {ButtonInteraction, CommandInteraction} from "discord.js";
import Play from "../../Commands/Music/Play";

export default class PlayLastButton extends Buttons {

    buttonName: string = "playlast";

    async execute(interaction: ButtonInteraction, args) {
        await new Play().execute(<CommandInteraction><unknown>interaction, {query: args[0]})
    }
}