import Commands from "../Commands";
import {CommandInteraction, GuildMember, Message, TextChannel} from "discord.js";
import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";

import {player} from "../../../../index";
import Play, {addSong} from "./Play";
import {APIMessage} from "discord-api-types";
import {checkMusicChannel, checkVC} from "../../../Extras";
import Queue from "../../../Music/Queue";
import Track from "../../../Music/Track";
import SQLMusicChannel from "../../../SQL/SQLMusicChannel";

export default class PlayNext extends Commands {

    commandName: string = "play-next";

    async execute(interaction: CommandInteraction, args) {
        if (!await checkMusicChannel(interaction.guild, interaction.channel.id))
            return interaction.reply({content: "❌ | Sorry, please use this command in <#" +
                    (await SQLMusicChannel.getMusicChannel(interaction.guild)).id + ">", ephemeral: true})
        if (await checkVC(interaction)) return;
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        if (!queue.connection || !queue.playing) await new Play().execute(interaction, args);
        else {
            let replied: Message = <Message>(await interaction.reply({
                content: "🔍 | Searching for song",
                fetchReply: true
            }))
            const query = args["query"];
            await addSong(queue, query, member, replied, true)
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