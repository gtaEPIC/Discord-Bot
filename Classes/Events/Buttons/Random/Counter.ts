import Buttons from "../Buttons";
import {ButtonInteraction, GuildMember, Message} from "discord.js";
import RollDice from "../../Commands/Random/RollDice";
import SQLCounters from "../../../SQL/SQLCounters";
import Counter from "../../Commands/Random/Counter";

export default class CounterButton extends Buttons {
    buttonName: string = "counter";

    async execute(interaction: ButtonInteraction, args) {
        let interacted: Message = <Message>interaction.message
        let owner = await SQLCounters.getOwner(interacted.id)
        if (!owner || owner === (<GuildMember>interaction.member).id) {
            let count: number = await SQLCounters.getCounter(interacted.id);
            if (args[0] === "-1") count--;
            else count++;
            let message: Message = <Message>await interaction.reply({
                content: await SQLCounters.getContent(interacted.id) + ": " + count + "\n" + (owner ? "Only <@" + owner + "> can use this" :
                    "Anyone can use this"),
                components: [new Counter().getButtons()],
                fetchReply: true
            })
            await SQLCounters.setCounter(interacted.id, message.id, count);
            await interacted.delete()
        }else{
            await interaction.reply({
                content: "Whoops, you don't have access to this counter",
                ephemeral: true
            })
        }
    }

}