import Buttons from "../Buttons";
import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, EmbedBuilder, Message} from "discord.js";
import QueueCommand from "../../Commands/Music/QueueCommand";

export default class QueueButton extends Buttons {
    buttonName: string = "queue";

    async execute(interaction: ButtonInteraction, args: any[]) {
        let embed: EmbedBuilder = new QueueCommand().getEmbed(interaction, {page: parseInt(args[0])})
        let message: Message = <Message>interaction.message;
        let actionRow: ActionRowBuilder<ButtonBuilder> = new QueueCommand().getButtons(interaction, {page: parseInt(args[0])})
        interaction.reply({content: "Updated", ephemeral: true, fetchReply: true}).then()
        await message.edit({
            embeds: [embed],
            components: [actionRow]
        })
    }

}