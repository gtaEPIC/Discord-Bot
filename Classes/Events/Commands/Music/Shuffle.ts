import Commands from "../Commands";
import {CommandInteraction, GuildMember, TextChannel} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import Queue from "../../../Music/Queue";
import {player} from "../../../../index";

export default class Shuffle extends Commands {
	commandName: string = "shuffle";

	createCommand(): object {
		return new SlashCommandBuilder().setName(this.commandName).setDescription("Shuffle the queue");
	}

	async execute(interaction: CommandInteraction, args: any) {
		try {
			let member: GuildMember = <GuildMember>interaction.member;
			let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel);
			if (queue.songs.length === 0)
				return await interaction.reply({
					content: "❌ | There are no songs in the queue",
					ephemeral: true,
				});
			else if (queue.songs.length === 1)
				return await interaction.reply({
					content: "❌ | There is only one song in the queue",
					ephemeral: true,
				});
			else {
				let message = await interaction.reply({
					content: "🔀 | Shuffling the queue",
					fetchReply: true,
				});
				try {
					queue.shuffle(message);
				} catch (e) {
					console.warn(e)
					await message.edit("❌ | Something went wrong while shuffling the queue\n" + e.message)
				}
			}
		}catch (e) {
			console.warn(e)
		}
	}

}