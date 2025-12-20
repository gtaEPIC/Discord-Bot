import Commands from "../Commands";
import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    CommandInteraction, EmbedBuilder,
    GuildMember,
    Interaction,
    TextChannel
} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {secondsToTime} from "../../../Extras";
import {player} from "../../../../index";
import Queue from "../../../Music/Queue";
import Track from "../../../Music/Track";

export default class HistoryCommand extends Commands {

    commandName: string = "history";

    getEmbed(interaction: Interaction, args): EmbedBuilder {
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        let track: Track = queue.playing;
        let embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("History:")
            .setDescription((track) ? "Currently Playing **" + track.name + "**\nHistory:" : "Nothing is playing right now. Last tracks played:");
        //console.log(min, max, page)
        console.log(queue.history);
        let page: number = args["page"];
        if (!page || page < 1) page = 1;
        let min: number = (page - 1) * 5;
        if (min > queue.history.length) min -= 5;
        let max: number = page * 5;
        if (max > queue.history.length) max = queue.history.length;
        for (let i = min; i < max; i++) {
            let song: Track = queue.history[i];
            embed.addFields({
                name: (i + 1) + ". " + song.name + " `(" + secondsToTime(song.duration) + ")`",
                value: "Author: " + song.author + "\n" +
                    "Was Requested By: <@" + song.requested.id + ">\n" +
                    "[Link](" + song.url + ")"

            })
        }
        if (queue.history.length === 0) {
            embed.addFields({
                name: "Nothing is in the history",
                value: "Songs are added here after they are done playing.\n" +
                    "Use the `/rewind` command to go back to one of these songs."

            })
        }
        let totalPages = Math.floor(queue.history.length / 5) + 1;
        embed.setFooter({
            text: "Page " + page + "/" + totalPages
        })
        return embed;
    }

    getButtons(interaction: Interaction, args) {
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        let totalPages = Math.floor(queue.history.length / 5) + 1;
        let page: number = args["page"];
        if (!page || page < 1) page = 1;
        let previousButton: ButtonBuilder = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("⬅ | Previous Page")
            .setCustomId("history+=+" + (page - 1))
            .setDisabled(page === 1);
        let refreshButton: ButtonBuilder = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel("🔄 | Refresh")
            .setCustomId("history+=+" + page);
        let nextButton: ButtonBuilder = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("➡ | Next Page")
            .setCustomId("history+=+" + (page + 1))
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
    }
}