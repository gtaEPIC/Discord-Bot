import Commands from "../Commands";
import {
    ActionRowBuilder,
    ButtonBuilder, ButtonStyle,
    CommandInteraction, EmbedBuilder,
    GuildMember,
    Message,
    TextChannel
} from "discord.js";
import {player} from "../../../../index";
import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {checkVC, secondsToTime} from "../../../Extras";
import Queue, {searchErrorReason} from "../../../Music/Queue";
import Track from "../../../Music/Track";
import PlayList from "../../../Music/PlayList";

export async function addSong(queue: Queue, query: string, member: GuildMember, replied: Message, next: boolean) {
    const results: Track | PlayList | searchErrorReason | null = await queue.search(query,member,replied);
    if (!results) return await replied.edit({ content: `❌ | Track **${query}** not found!` });
    if (results instanceof searchErrorReason) return await replied.edit({ content: `❌ | A problem occurred trying to get **${query}**!\nReason: ${results.reason}` });
    await queue.createConnection(replied);
    if (results instanceof PlayList) {
        let embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("Queued a Playlist")
            .setDescription("Playlist: [" + results.name + "](https://www.youtube.com/playlist?list=" + results.id + ")\n" +
                "Tracks that were added:")
        let button: ButtonBuilder = new ButtonBuilder()
            .setLabel("Show Queue")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("queue")
        let counts = 0;
        for (let track of results.tracks) {
            counts++;
            if (next) queue.addTrack(track, counts - 1)
            else queue.addTrack(track)
            // if (counts <= 5) embed.addField(track.name + " (" + secondsToTime(track.duration) + ")",
            //     "Author: " + track.author + "\n" +
            //     "[Link](" + track.url + ")");
            if (counts <= 5) embed.addFields({
                name: counts + ". " + track.name + " `(" + secondsToTime(track.duration) + ")`",
                value: "Author: " + track.author + "\n" +
                    "[Link](" + track.url + ")"
            });
        }
        counts -= 5;
        // if (counts > 0) embed.addField("Plus " + counts + " more", "Click the Show Queue button or use the `/queue` command to see all the songs")
        if (counts > 0) embed.addFields({
            name: "Plus " + counts + " more",
            value: "Click the Show Queue button or use the `/queue` command to see all the songs"
        });
        if (!queue.playing) queue.next().then()
        return await replied.edit({
            content: "✅ | Finished" + (next ? " songs were added to play next" : ""),
            embeds: [embed],
            components: [new ActionRowBuilder<ButtonBuilder>({components: [button]})]
        })
    }

    queue.play(results);

    //if (!queue.playing || !queue.paused) await queue.resume();

    return await replied.edit({ content: `⏱ | Queued track **${results.name}**` + (next ? " and will play next" : "") + "!"});
}

export default class Play extends Commands {
    async execute(interaction: CommandInteraction, args) {
        // if (!await checkMusicChannel(interaction.guild, interaction.channel.id))
        //     return interaction.reply({content: "❌ | Sorry, please use this command in <#" +
        //             (await SQLMusicChannel.getMusicChannel(interaction.guild)).id + ">", ephemeral: true})
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
        await addSong(queue, query, member, replied, false)
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