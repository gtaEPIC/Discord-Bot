import { open } from 'sqlite'
import {Channel, Guild, GuildChannel, TextBasedChannels, TextChannel, ThreadChannel} from "discord.js";
import {DBConfig, dbFile} from "../Extras";
import {DiscordFetchHelpers} from "../DiscordFetchHelper";
import {client} from "../../index";
let sqlite3 = require('sqlite3').verbose();

export default class SQLMusicChannel {
    static async getMusicChannel(guild: Guild): Promise<Channel | null> {
        const db = await open(DBConfig);
        const result = await db.get('SELECT Music_Channel FROM Guild_Settings WHERE Guild = ?',guild.id)
        if (!result) return null;
        return DiscordFetchHelpers.findChannel(client, guild, result.Music_Channel)
    }

    static async hasMusicChannel(guild: Guild): Promise<boolean> {
        const db = await open(DBConfig);
        const result = await db.get('SELECT Music_Channel FROM Guild_Settings WHERE Guild = ?', guild.id);
        return result != undefined;
    }

    static async setMusicChannel(guild: Guild, channel: TextChannel) {
        const db = await open(DBConfig);
        if (await this.hasMusicChannel(guild))
            await db.run('UPDATE Guild_Settings SET Music_Channel = ? WHERE Guild = ?', channel.id, guild.id)
        else await db.run('INSERT INTO Guild_Settings VALUES (?,?)', channel?.id, guild.id)
    }
}