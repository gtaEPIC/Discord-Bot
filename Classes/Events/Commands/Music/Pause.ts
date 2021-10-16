import Commands from "../Commands";
import {CommandInteraction, GuildMember, TextChannel} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {checkVC} from "../../../Extras";
import {player} from "../../../../index";
import Queue from "../../../Music/Queue";

export default class Pause extends Commands {

    commandName: string = "pause";

    async execute(interaction: CommandInteraction, args) {
        if (await checkVC(interaction)) return;
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        queue.pause()
        await interaction.reply("⏸ | Music Paused")
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Pauses the current song being played. Use /resume to continue the song")
    }
}