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
import {SlashCommandBuilder, SlashCommandIntegerOption} from "@discordjs/builders";
import {secondsToTime} from "../../../Extras";
import {player} from "../../../../index";
import Queue from "../../../Music/Queue";
import Track from "../../../Music/Track";
import {MessageButtonStyles} from "discord.js/typings/enums";

export default class QueueCommand extends Commands {

    commandName: string = "queue";

    getEmbed(interaction: Interaction, args): MessageEmbed {
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        let track: Track = queue.playing;
        let embed: MessageEmbed = new MessageEmbed()
            .setTitle("Queue:")
            .setDescription((track) ? "Currently Playing **" + track.name + "**\nNext Songs:" : "Nothing is playing right now.");
        let page: number = args["page"];
        if (!page || page < 1) page = 1;
        let min: number = (page - 1) * 5;
        if (min > queue.songs.length) min -= 5;
        let max: number = page * 5;
        if (max > queue.songs.length) max = queue.songs.length;
        //console.log(min, max, page)
        for (let i = min; i < max; i++) {
            let song: Track = queue.songs[i];
            embed.addField((i + 1) + ". " + song.name + " `(" + secondsToTime(song.duration) + ")`",
                "Author: " + song.author + "\n" +
                "[Link](" + song.url + ")\n" +
                "Requested By: <@" + song.requested.id + ">");
        }
        if (max === 0) {
            embed.addField("Nothing is in the queue", "There are no tracks in the queue.")
        }
        let totalPages = Math.floor(queue.songs.length / 5) + 1;
        embed.setFooter("Page " + page + "/" + totalPages);
        return embed;
    }
    getButtons(interaction: Interaction, args) {
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        let totalPages = Math.floor(queue.songs.length / 5) + 1;
        let page: number = args["page"];
        if (!page || page < 1) page = 1;
        let previousButton: MessageButton = new MessageButton()
            .setStyle(MessageButtonStyles.SECONDARY)
            .setLabel("⬅ | Previous Page")
            .setCustomId("queue+=+" + (page - 1))
            .setDisabled(page === 1);
        let refreshButton: MessageButton = new MessageButton()
            .setStyle(MessageButtonStyles.PRIMARY)
            .setLabel("🔄 | Refresh")
            .setCustomId("queue+=+" + page);
        let nextButton: MessageButton = new MessageButton()
            .setStyle(MessageButtonStyles.SECONDARY)
            .setLabel("➡ | Next Page")
            .setCustomId("queue+=+" + (page + 1))
            .setDisabled(page >= totalPages);
        return new MessageActionRow({components: [previousButton, refreshButton, nextButton]})
    }

    async execute(interaction: CommandInteraction, args) {
        //if (await checkVC(interaction)) return;
        let embed: MessageEmbed = this.getEmbed(interaction, args);
        let actionRow: MessageActionRow = this.getButtons(interaction, args)
        await interaction.reply({
            embeds: [embed],
            components: [actionRow]
        })
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Shows the current queue")
            .addIntegerOption(new SlashCommandIntegerOption()
                .setName("page")
                .setDescription("The page number for the queue list.")
            )
    }
}