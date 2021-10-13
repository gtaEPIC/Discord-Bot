import Commands from "../Commands";
import {CommandInteraction} from "discord.js";
import {Queue} from "Distube";
import {SlashCommandBuilder} from "@discordjs/builders";
import {checkVCAndQueue} from "../../../Extras";

export default class Resume extends Commands {

    commandName: string = "resume";

    async execute(interaction: CommandInteraction, args) {
        const queue: Queue = await checkVCAndQueue(interaction);
        if (!queue) return;
        queue.setPaused(false);
        await interaction.reply("▶ | Music Resumed")
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Resumes the current song being played. Use /pause to pause the song")
    }
}