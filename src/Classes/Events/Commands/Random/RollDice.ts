import Commands from "../Commands";
import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction} from "discord.js";
import {SlashCommandBuilder, SlashCommandNumberOption} from "@discordjs/builders";

export default class RollDice extends Commands {

    commandName: string = "roll";

    rollDice(sides: number, interaction: CommandInteraction | ButtonInteraction) {
        let random: number = Math.floor((Math.random() * (sides - 1)) + 1);
        let reRoll: ButtonBuilder = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel("Re-roll")
            .setCustomId("re-roll+=+" + sides)
        let actionRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>();
        actionRow.addComponents(reRoll)
        return interaction.reply({
            content: "🎲 | You rolled a " + random + " on a " + sides + " sided dice.",
            components: [actionRow]
        })
    }

    async execute(interaction: CommandInteraction, args) {
        if (args["sides"] && args["sides"] <= 1) return interaction.reply({
            content: "❌ | Invalid Sides",
            ephemeral: true
        })
        let sides: number = (args["sides"] ? args["sides"] : 6)
        await this.rollDice(sides, interaction)
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Rolls a dice")
            .addNumberOption(new SlashCommandNumberOption()
                .setName("sides")
                .setDescription("Default is 6")
                .setRequired(false)
            )
    }
}