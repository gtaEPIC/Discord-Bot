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
import {Embed, SlashCommandBuilder, SlashCommandIntegerOption} from "@discordjs/builders";
import {checkVC, secondsToTime} from "../../../Extras";
import {player} from "../../../../index";
import Queue from "../../../Music/Queue";
import Track from "../../../Music/Track";
import {MessageButtonStyles} from "discord.js/typings/enums";

export default class HistoryCommand extends Commands {

    commandName: string = "history";

    getEmbed(interaction: Interaction): MessageEmbed {
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        let track: Track = queue.playing;
        let embed: MessageEmbed = new MessageEmbed()
            .setTitle("History:")
            .setDescription((track) ? "Currently Playing **" + track.name + "**\nHistory:" : "Nothing is playing right now. Last tracks played:");
        //console.log(min, max, page)
        console.log(queue.history);
        for (let i = 0; i < queue.history.length; i++) {
            let song: Track = queue.history[i];
            embed.addField((i + 1) + ". " + song.name + " `(" + secondsToTime(song.duration) + ")`",
                "Author: " + song.author + "\n" +
                "Was Requested By: <@" + song.requested.id + ">\n" +
                "[Link](" + song.url + ")");
        }
        if (queue.history.length === 0) {
            embed.addField("Nothing is in the history", "Songs are added here after they are done playing.\n" +
                "Use the `/rewind` command to go back to one of these songs.")
        }
        return embed;
    }

    async execute(interaction: CommandInteraction, args) {
        //if (await checkVC(interaction)) return;
        let embed: MessageEmbed = this.getEmbed(interaction);
        let refreshButton: MessageButton = new MessageButton()
            .setStyle(MessageButtonStyles.PRIMARY)
            .setLabel("🔄 | Refresh")
            .setCustomId("history");
        let actionRow: MessageActionRow = new MessageActionRow({components: [refreshButton]})
        await interaction.reply({
            embeds: [embed],
            components: [actionRow]
        })
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Shows the current queue")
    }
}