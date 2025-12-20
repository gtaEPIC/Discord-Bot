import {SelectMenuInteraction} from "discord.js";

export default abstract class SelectMenu {
    abstract selectName: string;

    abstract execute(interaction: SelectMenuInteraction);

}
