import Buttons from "../Buttons";
import {ButtonInteraction, CommandInteraction} from "discord.js";
import Resume from "../../Commands/Music/Resume";

export default class PlayButton extends Buttons {
    buttonName: string = "play";

    execute(interaction: ButtonInteraction) {
        new Resume().execute(<CommandInteraction><unknown>interaction, []).then()
    }

}