import Buttons from "../Buttons";
import {ButtonInteraction, CommandInteraction} from "discord.js";
import Rewind from "../../Commands/Music/Rewind";

export default class PreviousButton extends Buttons {
    buttonName: string = "previous";

    execute(interaction: ButtonInteraction) {
        new Rewind().execute(<CommandInteraction><unknown>interaction, []).then()
    }

}