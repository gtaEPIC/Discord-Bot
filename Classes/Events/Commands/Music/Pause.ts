import Commands from "../Commands";
import {CommandInteraction} from "discord.js";
import {Queue} from "Distube";
import {SlashCommandBuilder} from "@discordjs/builders";
import {checkVCAndQueue} from "../../../Extras";

export default class Pause extends Commands {

    commandName: string = "pause";

    async execute(interaction: CommandInteraction, args) {
        const queue: Queue = await checkVCAndQueue(interaction);
        if (!queue) return;
        queue.setPaused(true);
        await interaction.reply("⏸ | Music Paused")
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Pauses the current song being played. Use /resume to continue the song")
    }
}