import Commands from "../Commands";
import {
    CommandInteraction,
    GuildMember,
    Interaction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    TextChannel
} from "discord.js";
import {Embed, SlashCommandBuilder} from "@discordjs/builders";
import {checkVC} from "../../../Extras";
import {player} from "../../../../index";
import Queue from "../../../Music/Queue";
import Track from "../../../Music/Track";
import {MessageButtonStyles} from "discord.js/typings/enums";

export default class NowPlaying extends Commands {

    commandName: string = "now-playing";

    getEmbed(interaction: Interaction): MessageEmbed {
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        let track: Track = queue.playing;
        let embed: MessageEmbed;
        if (track) {
            embed = new MessageEmbed()
                .setTitle("Now Playing:")
                .setDescription("**[" + track.name + "](" + track.url + ")**")
                .addField("Author",track.author)
                .addField("Progress",queue.getProgressBar(10, true))
                .setFooter("Requested by " + track.requested.user.username, track.requested.displayAvatarURL())
        }else{
            embed = new MessageEmbed()
                .setTitle("Nothing is playing")
                .setDescription("Use the `/play` command to add a song");
        }
        return embed
    }

    async execute(interaction: CommandInteraction, args) {
        //if (await checkVC(interaction)) return;
        let embed: MessageEmbed = this.getEmbed(interaction);
        let refreshButton: MessageButton = new MessageButton()
            .setStyle(MessageButtonStyles.PRIMARY)
            .setLabel("🔄 | Refresh")
            .setCustomId("nowplaying");
        let actionRow: MessageActionRow = new MessageActionRow({components: [refreshButton]})
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