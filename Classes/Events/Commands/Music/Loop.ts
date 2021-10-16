import Commands from "../Commands";
import {CommandInteraction, GuildMember, TextChannel} from "discord.js";
import {SlashCommandBuilder, SlashCommandStringOption} from "@discordjs/builders";
import {checkVC} from "../../../Extras";
import {player} from "../../../../index";
import Queue, {LoopModes} from "../../../Music/Queue";

export default class Loop extends Commands {

    commandName: string = "loop";

    async execute(interaction: CommandInteraction, args) {
        if (await checkVC(interaction)) return;
        let member: GuildMember = <GuildMember>interaction.member
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        let mode: LoopModes;
        let response: string;
        switch (args.state) {
            case "off":
                mode = LoopModes.OFF;
                response = "Loop Disabled"
                break;
            case "loop1":
                mode = LoopModes.TRACK;
                response = "🔂 | Track Loop Enabled"
                break;
            case "loopQ":
                mode = LoopModes.QUEUE;
                response = "🔁 | Queue Loop Enabled"
                break;
            default:
                await interaction.reply({content: "An Error Occurred. (E4001)", ephemeral: true});
                return;
        }
        queue.loop = mode;
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
                .setRequired(true)
            )
    }
}