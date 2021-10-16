import Buttons from "../Buttons";
import {ButtonInteraction, Message, MessageActionRow, MessageEmbed} from "discord.js";
import QueueCommand from "../../Commands/Music/QueueCommand";
import HistoryCommand from "../../Commands/Music/HistoryCommand";
import NowPlaying from "../../Commands/Music/NowPlaying";

export default class NowPlayingButton extends Buttons {
    buttonName: string = "nowplaying";

    async execute(interaction: ButtonInteraction) {
        let embed: MessageEmbed = new NowPlaying().getEmbed(interaction);
        let message: Message = <Message>interaction.message;
        interaction.reply({content: "Updated", ephemeral: true, fetchReply: true}).then()
        await message.edit({
            embeds: [embed]
        })
    }

}