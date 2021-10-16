import Buttons from "../Buttons";
import {ButtonInteraction, CommandInteraction} from "discord.js";
import Skip from "../../Commands/Music/Skip";

export default class SkipButton extends Buttons {
    buttonName: string = "skip";

    execute(interaction: ButtonInteraction) {
        new Skip().execute(<CommandInteraction><unknown>interaction, []).then()
    }

}