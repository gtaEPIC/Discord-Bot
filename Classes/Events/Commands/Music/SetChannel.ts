import Commands from "../Commands";
import {CommandInteraction, GuildMember, TextChannel,} from "discord.js";
import {SlashCommandBuilder, SlashCommandChannelOption} from "@discordjs/builders";
import SQLMusicChannel from "../../../SQL/SQLMusicChannel";
import {DiscordFetchHelpers} from "../../../DiscordFetchHelper";
import {client} from "../../../../index";


export default class SetChannel extends Commands {

    commandName: string = "set-channel";

    async execute(interaction: CommandInteraction, args) {
        let member: GuildMember = <GuildMember>interaction.member;
        if (member.id === "274311766517874691" || member.permissions.has("ADMINISTRATOR")) {
            await SQLMusicChannel.setMusicChannel(interaction.guild, <TextChannel>await DiscordFetchHelpers.findChannel(client, interaction.guild, args["channel"]))
            await interaction.reply({content: "Channel has been set", ephemeral: true})
        }else{
            await interaction.reply({content: "Sorry you don't have permissions to do that", ephemeral: true})
        }
    }

    createCommand(): object {
        return new SlashCommandBuilder()
            .setName(this.commandName)
            .setDescription("Requires Admin, set's the music channel for the bot. Only /play commands will work there")
            .addChannelOption(new SlashCommandChannelOption()
                .setName("channel")
                .setDescription("The channel for the /play commands to only work in")
                .setRequired(true)
            )
    }
}