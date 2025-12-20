import Commands from "../Commands";
import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    CommandInteraction, EmbedBuilder,
    GuildMember,
    Interaction,
    TextChannel
} from "discord.js";
import { SlashCommandBuilder} from "@discordjs/builders";
import {player} from "../../../../index";
import Queue from "../../../Music/Queue";
import Track from "../../../Music/Track";

export default class NowPlaying extends Commands {

    commandName: string = "now-playing";

    getEmbed(interaction: Interaction): EmbedBuilder {
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        let track: Track = queue.playing;
        let embed: EmbedBuilder;
        if (track) {
            embed = new EmbedBuilder()
                .setTitle("Now Playing:")
                .setDescription("**[" + track.name + "](" + track.url + ")**")
                .addFields({name: "Author", value: track.author, inline: true}, {name: "Progress", value: queue.getProgressBar(10, true), inline: true})
                .setFooter({
                    text: "Requested by " + track.requested.user.username,
                    iconURL: track.requested.displayAvatarURL()
                })
        }else{
            embed = new EmbedBuilder()
                .setTitle("Nothing is playing")
                .setDescription("Use the `/play` command to add a song");
        }
        return embed
    }

    async execute(interaction: CommandInteraction,) {
        //if (await checkVC(interaction)) return;
        let embed: EmbedBuilder = this.getEmbed(<Interaction>interaction);
        let refreshButton: ButtonBuilder = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel("🔄 | Refresh")
            .setCustomId("nowplaying");
        let actionRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>({components: [refreshButton]})
        await interaction.reply({
            embeds: [embed],
            components: [actionRow]
        })
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Shows information about the current track")
    }
}