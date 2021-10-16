import Commands from "../Commands";
import {CommandInteraction, GuildMember, TextChannel} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {checkVC} from "../../../Extras";
import {player} from "../../../../index";
import Queue from "../../../Music/Queue";

export default class Skip extends Commands {

    commandName: string = "skip";

    async execute(interaction: CommandInteraction, args) {
        if (await checkVC(interaction)) return;
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        await interaction.deferReply();
        queue.skip();
        await interaction.followUp("⏭ | Track Skipped")
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Skips to the next song")
    }
}