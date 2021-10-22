import { open } from 'sqlite'
import {Channel, Guild, GuildChannel, TextBasedChannels, TextChannel, ThreadChannel} from "discord.js";
import {DBConfig, dbFile} from "../Extras";
import {DiscordFetchHelpers} from "../DiscordFetchHelper";
import {client} from "../../index";
let sqlite3 = require('sqlite3').verbose();

export default class SQLCounters {
    static async getCounter(message: string): Promise<number | null> {
        const db = await open(DBConfig);
        const result = await db.get('SELECT * FROM Counters WHERE Message = ?', message)
        if (!result) return null;
        return result.Counter
    }

    static async getOwner(message: string): Promise<string | null> {
        const db = await open(DBConfig);
        const result = await db.get('SELECT * FROM Counters WHERE Message = ?', message)
        if (!result) return null;
        return result.Shared
    }

    static async getContent(message: string): Promise<string | null> {
        const db = await open(DBConfig);
        const result = await db.get('SELECT * FROM Counters WHERE Message = ?', message)
        if (!result) return null;
        return result.Content
    }

    static async hasCounter(message: string): Promise<boolean> {
        const db = await open(DBConfig);
        const result = await db.get('SELECT * FROM Counters WHERE Message = ?', message);
        return result != undefined;
    }

    static async setCounter(oldMessage: string, message: string, counter: number) {
        const db = await open(DBConfig);
        if (await this.hasCounter(oldMessage))
            await db.run('UPDATE Counters SET Message = ?, Counter = ? WHERE Message = ?',message, counter, oldMessage)
        else throw new Error("Counter doesn't exist")
    }

    static async newCounter(message: string, counter: number, content: string, shared: string) {
        const db = await open(DBConfig);
        if (!await this.hasCounter(message))
            await db.run('INSERT INTO Counters VALUES (?,?,?,?)',message, counter, shared, content)
        else throw new Error("Counter already exist")
    }
}