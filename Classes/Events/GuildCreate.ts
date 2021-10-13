import {Guild} from "discord.js";
import {createCommands} from "../Extras";

export default async function (guild: Guild) {
    await createCommands(guild);
}