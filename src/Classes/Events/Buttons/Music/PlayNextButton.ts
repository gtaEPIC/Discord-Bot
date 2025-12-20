import Buttons from "../Buttons";
import {ButtonInteraction, CommandInteraction} from "discord.js";
import PlayNext from "../../Commands/Music/PlayNext";

export default class PlayNextButton extends Buttons {

    buttonName: string = "playnext";

    async execute(interaction: ButtonInteraction, args) {
        await new PlayNext().execute(<CommandInteraction><unknown>interaction, {query: args[0]})
    }
}