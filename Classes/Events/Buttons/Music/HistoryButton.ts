import Buttons from "../Buttons";
import {ButtonInteraction, EmbedBuilder, Message} from "discord.js";
import HistoryCommand from "../../Commands/Music/HistoryCommand";

export default class HistoryButton extends Buttons {
    buttonName: string = "history";

    async execute(interaction: ButtonInteraction) {
        let embed: EmbedBuilder = new HistoryCommand().getEmbed(interaction);
        let message: Message = <Message>interaction.message;
        interaction.reply({content: "Updated", ephemeral: true, fetchReply: true}).then()
        await message.edit({
            embeds: [embed]
        })
    }

}