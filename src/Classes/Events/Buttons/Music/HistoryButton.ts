import Buttons from "../Buttons";
import {ButtonInteraction, EmbedBuilder, Message} from "discord.js";
import HistoryCommand from "../../Commands/Music/HistoryCommand";

export default class HistoryButton extends Buttons {
    buttonName: string = "history";

    async execute(interaction: ButtonInteraction, args: any[]) {
        let embed: EmbedBuilder = new HistoryCommand().getEmbed(interaction, {page: parseInt(args[0])});
        let message: Message = <Message>interaction.message;
        let actionRow = new HistoryCommand().getButtons(interaction, {page: parseInt(args[0])})
        interaction.reply({content: "Updated", ephemeral: true, fetchReply: true}).then()
        await message.edit({
            embeds: [embed],
            components: [actionRow]
        })
    }

}