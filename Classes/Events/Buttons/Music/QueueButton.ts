import Buttons from "../Buttons";
import {ButtonInteraction, Message, MessageActionRow, MessageEmbed} from "discord.js";
import QueueCommand from "../../Commands/Music/QueueCommand";

export default class QueueButton extends Buttons {
    buttonName: string = "queue";

    async execute(interaction: ButtonInteraction, args: any[]) {
        let embed: MessageEmbed = new QueueCommand().getEmbed(interaction, {page: parseInt(args[0])})
        let message: Message = <Message>interaction.message;
        let actionRow: MessageActionRow = new QueueCommand().getButtons(interaction, {page: parseInt(args[0])})
        interaction.reply({content: "Updated", ephemeral: true, fetchReply: true}).then()
        await message.edit({
            embeds: [embed],
            components: [actionRow]
        })
    }

}