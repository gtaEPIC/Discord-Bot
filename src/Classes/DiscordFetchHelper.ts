import {
    Client,
    Guild,
    Snowflake,
    TextChannel,
    Message,
    GuildMember, User, Channel
} from "discord.js";

export class DiscordFetchHelpers {
    static async findGuild(client: Client, id: Snowflake): Promise<Guild | null> {
        const cachedGuild = client.guilds.cache.get(id)
        return cachedGuild ? cachedGuild : await client.guilds.fetch(id);
    }

    static async findChannel(client: Client, guild: Guild, id: Snowflake): Promise<Channel | null> {
        const cachedChannel = guild.channels.cache.get(id)
        return cachedChannel ? cachedChannel : await guild.channels.fetch(id)
    }

    static async findMessage(client: Client, channel: TextChannel, id: Snowflake): Promise<Message | null> {
        const cachedChannel = channel.messages.cache.get(id)
        return cachedChannel ? cachedChannel : await channel.messages.fetch(id)
    }

    static async findUser(client: Client, id: Snowflake): Promise<User | null> {
        const cachedChannel = client.users.cache.get(id)
        return cachedChannel ? cachedChannel : await client.users.fetch(id)
    }

    static checkForRole(client: Client, member: GuildMember, id: Snowflake): boolean {
        return member.roles.cache.has(id)
    }

    /**
     * @deprecated
     * @param client
     * @param id
     */
    // static async searchMessage(client: Client, id: Snowflake): Promise<Message | null> {
    //     let final;
    //     await Promise.all(client.guilds.cache.map((guild) => {
    //         guild.channels.cache.map(async (channel:TextChannel) => {
    //             if (channel.type === "GUILD_TEXT") {
    //                 final = await this.findMessage(client, channel, id)
    //             }
    //         })
    //     }))
    //     return final;
    // }
}