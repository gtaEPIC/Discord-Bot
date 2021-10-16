import Commands from "../Commands";
import {CommandInteraction, GuildMember, TextChannel} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {checkVC} from "../../../Extras";
import {player} from "../../../../index";
import Queue from "../../../Music/Queue";

export default class Rewind extends Commands {

    commandName: string = "rewind";

    async execute(interaction: CommandInteraction, args) {
        if (await checkVC(interaction)) return;
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        if (queue.rewind()) await interaction.reply("⏮ | Playing the previous song");
        else await interaction.reply("❌ | There are no previous songs stored")
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Plays the previously played song")
    }
}