import Commands from "../Commands";
import {CommandInteraction} from "discord.js";
import {Queue} from "Distube";
import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {checkVCAndQueue} from "../../../Extras";

export default class Loop extends Commands {

    commandName: string = "loop";

    async execute(interaction: CommandInteraction, args) {
        const queue: Queue = await checkVCAndQueue(interaction);
        if (!queue) return;
        let mode: QueueRepeatMode;
        let response: string;
        switch (args.state) {
            case "off":
                mode = QueueRepeatMode.OFF;
                response = "Loop Disabled"
                break;
            case "loop1":
                mode = QueueRepeatMode.TRACK;
                response = "🔂 | Track Loop Enabled"
                break;
            case "loopQ":
                mode = QueueRepeatMode.QUEUE;
                response = "🔁 | Queue Loop Enabled"
                break;
            default:
                await interaction.reply({content: "An Error Occurred. (E4001)", ephemeral: true});
                return;
        }
        queue.setRepeatMode(mode)
        await interaction.reply(response)
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Sets the looping state of the queue")
            .addStringOption(new SlashCommandStringOption()
                .setName("state")
                .setDescription("The state the loop should be in")
                .addChoice("Off", "off")
                .addChoice("Loop Song", "loop1")
                .addChoice("Loop Queue", "loopQ")
            )
    }
}