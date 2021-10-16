import Commands from "../Commands";
import {CommandInteraction, GuildMember, Message, TextChannel} from "discord.js";
import {player} from "../../../../index";
import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {checkVC} from "../../../Extras";
import Queue from "../../../Music/Queue";
import Track from "../../../Music/Track";

export default class Play extends Commands {
    async execute(interaction: CommandInteraction, args) {
        if (await checkVC(interaction)) return;
        let member: GuildMember;
        try {
            member = <GuildMember>interaction.member;
        }catch (e) {
            await interaction.reply({content: "Whoops, an error Occurred. (E5001)", ephemeral: true});
            return;
        }
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel);
        let replied: Message = <Message>(await interaction.reply({content: "🔍 | Searching for song", fetchReply: true}))
        const query = args["query"];
        const results: Track = await queue.search(query,member);
        if (!results) return await replied.edit({ content: `❌ | Track **${query}** not found!` });
        try {
            if (!queue.connection) {
                await replied.edit("🔈 | Attempting to join channel")
                await queue.connect()
            }
        } catch (e) {
            console.log(e);
            await replied.edit({ content: "❌ | An error occurred while attempting to join!" });
            queue.delete()
            return
        }

        queue.play(results);

        //if (!queue.playing || !queue.paused) await queue.resume();

        return await replied.edit({ content: `⏱ | Queued track **${results.name}**!` });
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