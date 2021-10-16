import Commands from "../Commands";
import {CommandInteraction, GuildMember, TextChannel} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {checkVC} from "../../../Extras";
import {player} from "../../../../index";
import Queue from "../../../Music/Queue";

export default class Resume extends Commands {

    commandName: string = "resume";

    async execute(interaction: CommandInteraction, args) {
        if (await checkVC(interaction)) return;
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        queue.resume();
        await interaction.reply("▶ | Music Resumed")
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Resumes the current song being played. Use /pause to pause the song")
    }
}