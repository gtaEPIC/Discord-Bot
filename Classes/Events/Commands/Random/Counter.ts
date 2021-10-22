import Commands from "../Commands";
import {CommandInteraction, GuildMember, Message, MessageActionRow, MessageButton} from "discord.js";
import {
    SlashCommandBooleanOption,
    SlashCommandBuilder,
    SlashCommandNumberOption,
    SlashCommandStringOption
} from "@discordjs/builders";
import {MessageButtonStyles} from "discord.js/typings/enums";
import SQLCounters from "../../../SQL/SQLCounters";

export default class Counter extends Commands {

    commandName: string = "counter";

    getButtons(): MessageActionRow {
        return new MessageActionRow({
            components: [
                new MessageButton()
                    .setStyle(MessageButtonStyles.DANGER)
                    .setLabel("-1")
                    .setCustomId("counter+=+-1"),
                new MessageButton()
                    .setStyle(MessageButtonStyles.PRIMARY)
                    .setLabel("+1")
                    .setCustomId("counter+=++1")
            ]
        })
    }

    async execute(interaction: CommandInteraction, args) {
        let count = args["start-value"];
        if (!count) count = 0;
        let member: GuildMember = <GuildMember>interaction.member
        let message: Message = <Message>await interaction.reply({
            content: args["content"] + ": " + count + "\n" + (!args["shared"] ? "Only <@" + member.id + "> can use this" :
                "Anyone can use this"),
            components: [this.getButtons()],
            fetchReply: true
        })
        await SQLCounters.newCounter(message.id, count, args["content"], !args["shared"] ? member.id : null)
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Rolls a dice")
            .addStringOption(new SlashCommandStringOption()
                .setName("content")
                .setDescription("Content of the counter. TIP: Content already ends with (:)")
                .setRequired(true)
            ).addBooleanOption(new SlashCommandBooleanOption()
                .setName("shared")
                .setDescription("Can other access the counter?")
                .setRequired(true)
            ).addNumberOption(new SlashCommandNumberOption()
                .setName("start-value")
                .setDescription("The starting value of the counter. Default: 0")
                .setRequired(false)
            )
    }
}