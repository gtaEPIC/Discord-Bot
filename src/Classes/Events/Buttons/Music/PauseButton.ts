import Buttons from "../Buttons";
import {ButtonInteraction, CommandInteraction} from "discord.js";
import Pause from "../../Commands/Music/Pause";

export default class PauseButton extends Buttons {
    buttonName: string = "pause";

    execute(interaction: ButtonInteraction) {
        new Pause().execute(<CommandInteraction><unknown>interaction, []).then()
    }

}