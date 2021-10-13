import {CommandInteraction, Guild, GuildMember, Interaction, TextChannel} from "discord.js";
import { REST } from "@discordjs/rest";
import {APIInteractionGuildMember, Routes} from "discord-api-types/v9";
import {client, player} from "../index";
import {commands} from "./Events/InteractionCreated";
import {Queue} from "discord-player";
require("dotenv").config();

export async function createCommands(guild: Guild): Promise<Boolean> {
    const cmd = commands.map(command => command.createCommand())

    const botID = process.env.BOT
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(botID);
    try {
        if (!guild.id) {
            await rest.put(
                Routes.applicationCommands(CLIENT_ID), {
                    body: cmd
                },
            );
            console.log('Successfully registered application commands globally');
        } else {
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID, guild.id), {
                    body: cmd
                },
            );
            console.log('Successfully registered application commands for development guild');
        }
    } catch (error) {
        if (error) console.error(error);
        return false;
    }
    return true;
}

export async function vcCheck(myVC, userVC, interaction: CommandInteraction): Promise<boolean> {
    if (myVC) {
        if (userVC) {
            if (userVC !== myVC) {
                await interaction.reply({content: "I'm already in <#" + myVC + ">", ephemeral: true});
                return true;
            }
        } else {
            await interaction.reply({
                content: "You aren't in a vc. But you can join me in <#" + myVC + ">",
                ephemeral: true
            });
            return true;
        }
    } else {
        if (!userVC) {
            await interaction.reply({content: "Whoops join a vc first. I'm free :D", ephemeral: true})
            return true;
        }
    }
    return false;
}

export async function fullCheck(interaction: CommandInteraction, member: GuildMember): Promise<boolean> {
    const myVC = interaction.guild.me.voice.channelId
    const userVC = member.voice.channelId;
    try {
        if (await vcCheck(myVC, userVC, interaction)) return true;
    }catch (e) {
        console.log(e);
        await interaction.reply({content: "Whoops, an error occurred. (E5002)", ephemeral: true});
        return true;
    }
    return false;
}

export function getQueue(guild: Guild, channel: TextChannel): Queue {
    return player.createQueue(guild, {
        metadata: {
            channel: channel
        },
        leaveOnEnd: false,
        leaveOnEmpty: false
    });
}

export async function checkVCAndQueue(interaction: CommandInteraction): Promise<Queue> {
    let member: GuildMember;
    try {
        member = <GuildMember>interaction.member;
    }catch (e) {
        await interaction.reply({content: "Whoops, an error Occurred. (E5001)", ephemeral: true});
        return;
    }
    await fullCheck(interaction, member);
    let queue: Queue;
    let channel: TextChannel = <TextChannel>interaction.channel;
    try {
        queue = getQueue(interaction.guild, channel)
    } catch (e) {
        console.log(e);
        await interaction.reply({content: "Whoops, an error occurred. (E5003)", ephemeral: true});
        return;
    }
    return queue;
}