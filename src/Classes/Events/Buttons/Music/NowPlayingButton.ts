import Buttons from "../Buttons";
import {ButtonInteraction, EmbedBuilder, Message} from "discord.js";
import NowPlaying from "../../Commands/Music/NowPlaying";

export default class NowPlayingButton extends Buttons {
    buttonName: string = "nowplaying";

    async execute(interaction: ButtonInteraction) {
        let embed: EmbedBuilder = new NowPlaying().getEmbed(interaction);
        let message: Message = <Message>interaction.message;
        interaction.reply({content: "Updated", ephemeral: true, fetchReply: true}).then()
        await message.edit({
            embeds: [embed]
        })
    }

}