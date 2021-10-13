import Commands from "../Commands";
import {CommandInteraction, Message} from "discord.js";
import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {Queue} from "Distube";
import {player} from "../../../../index";
import Play from "./Play";
import {APIMessage} from "discord-api-types";
import {checkVCAndQueue} from "../../../Extras";

export default class PlayNext extends Commands {

    commandName: string = "play-next";

    async execute(interaction: CommandInteraction, args) {
        const queue: Queue = await checkVCAndQueue(interaction);
        if (!queue) return;
        if (!queue.connection) await new Play().execute(interaction, args);
        else {
            let replied: Message | APIMessage = await interaction.reply({
                content: "🔍 | Searching for song",
                fetchReply: true
            })
            if (!(replied instanceof Message) || replied.partial) return;
            const query = args["query"];
            const track = await player.search(query, {
                requestedBy: interaction.user
            }).then(x => x.tracks[0]);
            if (!track) return await replied.edit({ content: `❌ | Track **${query}** not found!` });
            queue.insert(track)
            await replied.edit(`⏱ | Queued track **${track.title}**! It will be played next`)
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