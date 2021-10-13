import {client} from "../../index";
import {createCommands} from "../Extras";

export default async function () {
    console.log("Logged in as " + client.user.tag);
    client.guilds.cache.forEach(await (async (guild) => {
        await createCommands(guild);
    }))
}