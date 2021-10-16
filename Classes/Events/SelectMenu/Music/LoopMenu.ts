import SelectMenu from "../SelectMenu";
import {CommandInteraction, GuildMember, SelectMenuInteraction, TextChannel} from "discord.js";
import Queue, {LoopModes} from "../../../Music/Queue";
import {player} from "../../../../index";
import {checkVC} from "../../../Extras";

export default class LoopMenu extends SelectMenu{

    selectName: string = "loop";

    async execute(interaction: SelectMenuInteraction) {
        if (await checkVC(<CommandInteraction><unknown>interaction)) return;
        let newLoop: LoopModes;
        let response: string;
        switch (interaction.values[0]) {
            case "off":
                newLoop = LoopModes.OFF;
                response = "Loop Disabled"
                break;
            case "song":
                newLoop = LoopModes.TRACK;
                response = "🔂 | Track Loop Enabled"
                break;
            case "queue":
                newLoop = LoopModes.QUEUE;
                response = "🔁 | Queue Loop Enabled"
                break;
            default:
                return;
        }
        let member: GuildMember = <GuildMember>interaction.member;
        let queue: Queue = player.createQueue(interaction.guild, member.voice.channel, <TextChannel>interaction.channel)
        queue.loop = newLoop;
        await interaction.reply({
            content: response
        });
    }
}