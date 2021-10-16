import Commands from "../Commands";
import {CommandInteraction, GuildMember, Message, TextChannel} from "discord.js";
import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";

import {player} from "../../../../index";
import Play from "./Play";
import {APIMessage} from "discord-api-types";
import {checkVC} from "../../../Extras";
import Queue from "../../../Music/Queue";
import Track from "../../../Music/Track";

export default class PlayNext extends Commands {

    commandName: string = "play-next";

    async execute(interaction: CommandInteraction, args) {
        if (await checkVC(interaction)) return;
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        if (!queue.connection) await new Play().execute(interaction, args);
        else {
            let replied: Message = <Message>(await interaction.reply({
                content: "🔍 | Searching for song",
                fetchReply: true
            }))
            const query = args["query"];
            const results: Track = await queue.search(query, member);
            if (!results) return await replied.edit({ content: `❌ | Track **${query}** not found!` });
            queue.addTrack(results, 1);
            await replied.edit(`⏱ | Queued track **${results.name}**! It will be played next`)
        }
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Add a song to the queue to play next")
            .addStringOption(new SlashCommandStringOption()
                .setName("query")
                .setDescription("Link to audio source")
                .setRequired(true)
            )
    }
}