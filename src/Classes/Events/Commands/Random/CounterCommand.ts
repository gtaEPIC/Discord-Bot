import Commands from "../Commands";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, GuildMember, Message} from "discord.js";
import {
    SlashCommandBooleanOption,
    SlashCommandBuilder,
    SlashCommandNumberOption,
    SlashCommandStringOption
} from "@discordjs/builders";
import Counter from "../../../Random/Counter";

export default class CounterCommand extends Commands {

    commandName: string = "counter";


    getButtons(): ActionRowBuilder {
        return new ActionRowBuilder({
            components: [
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("-1")
                    .setCustomId("counter+=+remove"),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("+1")
                    .setCustomId("counter+=+add")
            ]
        })
    }

    async execute(interaction: CommandInteraction, args) {
        let member: GuildMember = <GuildMember>interaction.member
        let content: string = args["content"];
        let shared: boolean = args["shared"];
        let startingNumber: number = args["start-value"] || 0;
        let message: Message = <Message> await interaction.deferReply({
            fetchReply: true
        });
        let counter = await Counter.create((!shared ? member.id : null), content, message.id, startingNumber);
        return interaction.followUp({
            content: counter.toDiscordString(),
            components: [counter.getButtons()],
        })
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Create a counter")
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