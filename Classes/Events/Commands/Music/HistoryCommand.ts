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

    getEmbed(interaction: Interaction): EmbedBuilder {
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        let track: Track = queue.playing;
        let embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("History:")
            .setDescription((track) ? "Currently Playing **" + track.name + "**\nHistory:" : "Nothing is playing right now. Last tracks played:");
        //console.log(min, max, page)
        console.log(queue.history);
        for (let i = 0; i < queue.history.length; i++) {
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
        return embed;
    }

    async execute(interaction: CommandInteraction) {
        //if (await checkVC(interaction)) return;
        let embed: EmbedBuilder = this.getEmbed(<Interaction>interaction);
        let refreshButton: ButtonBuilder = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel("🔄 | Refresh")
            .setCustomId("history");
        let actionRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>({components: [refreshButton]})
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