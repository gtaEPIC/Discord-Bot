import Buttons from "../Buttons";
import {ButtonInteraction, CommandInteraction} from "discord.js";
import Stop from "../../Commands/Music/Stop";

export default class StopButton extends Buttons {
    buttonName: string = "stop";

    execute(interaction: ButtonInteraction) {
        new Stop().execute(<CommandInteraction><unknown>interaction, []).then()
    }

}