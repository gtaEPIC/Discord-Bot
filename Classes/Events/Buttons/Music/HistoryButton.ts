import Buttons from "../Buttons";
import {ButtonInteraction, Message, MessageActionRow, MessageEmbed} from "discord.js";
import QueueCommand from "../../Commands/Music/QueueCommand";
import HistoryCommand from "../../Commands/Music/HistoryCommand";

export default class HistoryButton extends Buttons {
    buttonName: string = "history";

    async execute(interaction: ButtonInteraction) {
        let embed: MessageEmbed = new HistoryCommand().getEmbed(interaction);
        let message: Message = <Message>interaction.message;
        interaction.reply({content: "Updated", ephemeral: true, fetchReply: true}).then()
        await message.edit({
            embeds: [embed]
        })
    }

}