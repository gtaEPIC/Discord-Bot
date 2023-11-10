import {
    CommandInteraction,
    Guild,
    GuildMember,
} from "discord.js";
import { REST } from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import {client} from "../index";
import {commands} from "./Events/InteractionCreated";
require("dotenv").config();

// export async function checkMusicChannel(guild: Guild, channelId: string): Promise<boolean> {
//     if (!await SQLMusicChannel.hasMusicChannel(guild)) return true;
//     let setChannel = await SQLMusicChannel.getMusicChannel(guild);
//     return setChannel.id === channelId;
// }

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
    //console.log("No Vc Check")
    return false;
}

export async function fullCheck(interaction: CommandInteraction, member: GuildMember): Promise<boolean> {
    const myVC = member.guild.members.me.voice.channelId;
    const userVC = member.voice.channelId;
    try {
        if (await vcCheck(myVC, userVC, interaction)) return true;
    }catch (e) {
        console.log(e);
        await interaction.reply({content: "Whoops, an error occurred. (E5002)", ephemeral: true});
        return true;
    }
    //console.log("All Good Check")
    return false;
}

export async function checkVC(interaction: CommandInteraction): Promise<boolean> {
    let member: GuildMember;
    try {
        member = <GuildMember>interaction.member;
    }catch (e) {
        await interaction.reply({content: "Whoops, an error Occurred. (E5001)", ephemeral: true});
        return;
    }
    return await fullCheck(interaction, member);
}

/**
 * Converts a number to double digits in a String
 * @param number The number to be formatted
 */
export function toDoubleDigits(number: number) {
    if (number < 10) {
        return "0" + number;
    }else{
        return number.toString();
    }
}

export function timeToSeconds(time: string): number {
    let mins = time.split(":")[0];
    let secs = time.split(":")[1];
    let seconds = parseInt(secs);
    seconds += parseInt(mins) * 60;
    return seconds;
}
export function secondsToTime(seconds: number): string {
    let mins = Math.floor(seconds / 60);
    seconds -= mins * 60
    return mins + ":" + toDoubleDigits(seconds);
}