import Commands from "../Commands";
import {CommandInteraction, GuildMember, Message} from "discord.js";
import {APIMessage} from "discord-api-types";
import {player} from "../../../../index";
import Song, {Queue} from "distube";
import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {checkVCAndQueue} from "../../../Extras";
import SearchResult from "distube";
import DisTube from "distube";

export default class Play extends Commands {
    async execute(interaction: CommandInteraction, args) {
        const queue: Queue = await checkVCAndQueue(interaction);
        if (!queue) return;
        let member: GuildMember;
        try {
            member = <GuildMember>interaction.member;
        }catch (e) {
            await interaction.reply({content: "Whoops, an error Occurred. (E5001)", ephemeral: true});
            return;
        }
        let replied: Message | APIMessage = await interaction.reply({content: "🔈 | Attempting to join channel", fetchReply: true})
        if (!(replied instanceof Message) || replied.partial) return;
        try {
            if (!queue.voice.connection) await queue.voice.join(member.voice.channel);
        } catch (e) {
            console.log(e);
            queue.delete()
            return await replied.edit({ content: "❌ | An error occurred while attempting to join!" });
        }
        const query = args["query"];
        await replied.edit("🔍 | Searching for song")
        const track: Array<SearchResult> = (await player.search(query));
        if (!track) return await replied.edit({ content: `❌ | Track **${query}** not found!` });

        const playlist = track.playlist;

        playlist ? queue.addTracks(playlist.tracks) : queue.addTrack(track);
        if (!queue.playing) await queue.play();

        //await queue.play(track);

        return await replied.edit({ content: `⏱ | Queued track **${track.title}**!` });
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName("play")
            .setDescription("Play / Add a song to the queue for the bot to play")
            .addStringOption(new SlashCommandStringOption().setName("query").setDescription("Link to audio source").setRequired(true))
            .toJSON();
    }

    commandName: string = "play";

}