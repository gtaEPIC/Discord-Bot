import Buttons from "../Buttons";
import {ButtonInteraction} from "discord.js";
import RollDice from "../../Commands/Random/RollDice";

export default class ReRoll extends Buttons {
    buttonName: string = "re-roll";

    execute(interaction: ButtonInteraction, args) {
        new RollDice().rollDice(parseInt(args[0]), interaction).then()
    }

}