import Commands from "../Commands";
import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    CommandInteraction, EmbedBuilder,
    GuildMember,
    Interaction,
    TextChannel
} from "discord.js";
import {SlashCommandBuilder, SlashCommandIntegerOption} from "@discordjs/builders";
import {secondsToTime} from "../../../Extras";
import {player} from "../../../../index";
import Queue from "../../../Music/Queue";
import Track from "../../../Music/Track";

export default class QueueCommand extends Commands {

    commandName: string = "queue";

    getEmbed(interaction: Interaction, args): EmbedBuilder {
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        let track: Track = queue.playing;
        let embed: EmbedBuilder = new EmbedBuilder()
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
            embed.addFields({
                name: (i + 1) + ". " + song.name + " `(" + secondsToTime(song.duration) + ")`",
                value: "Author: " + song.author + "\n" + "[Link](" + song.url + ")\n" + "Requested By: <@" + song.requested.id + ">"
            })
        }
        if (max === 0) {
            embed.addFields({
                name: "Nothing is in the queue",
                value: "There are no tracks in the queue."
            })
        }
        let totalPages = Math.floor(queue.songs.length / 5) + 1;
        // embed.setFooter("Page " + page + "/" + totalPages);
        embed.setFooter({
            text: "Page " + page + "/" + totalPages
        })
        return embed;
    }
    getButtons(interaction: Interaction, args) {
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        let totalPages = Math.floor(queue.songs.length / 5) + 1;
        let page: number = args["page"];
        if (!page || page < 1) page = 1;
        let previousButton: ButtonBuilder = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("⬅ | Previous Page")
            .setCustomId("queue+=+" + (page - 1))
            .setDisabled(page === 1);
        let refreshButton: ButtonBuilder = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel("🔄 | Refresh")
            .setCustomId("queue+=+" + page);
        let nextButton: ButtonBuilder = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("➡ | Next Page")
            .setCustomId("queue+=+" + (page + 1))
            .setDisabled(page >= totalPages);
        return new ActionRowBuilder<ButtonBuilder>({components: [previousButton, refreshButton, nextButton]})
    }

    async execute(interaction: CommandInteraction, args) {
        //if (await checkVC(interaction)) return;
        let embed: EmbedBuilder = this.getEmbed(<Interaction>interaction, args);
        let actionRow: ActionRowBuilder<ButtonBuilder> = this.getButtons(<Interaction>interaction, args)
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