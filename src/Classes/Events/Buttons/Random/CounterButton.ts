import Buttons from "../Buttons";
import {ButtonInteraction, GuildMember, Message} from "discord.js";
import Counter from "../../../Random/Counter";

export default class CounterButton extends Buttons {
    buttonName: string = "counter";

    async execute(interaction: ButtonInteraction, args) {
        let interacted: Message = <Message>interaction.message;
        let counter: Counter = await Counter.fetchByDiscordMessageId(interacted.id);
        if (!counter) {
            await interaction.reply({
                content: "Whoops, this counter is no longer valid",
                ephemeral: true
            })
            return;
        }
        if (!counter.owner || counter.owner === (<GuildMember>interaction.member).id) {
            if (args[0] === "add") await counter.increment();
            else await counter.decrement();
            let newMessage = await interaction.reply({
                content: counter.toDiscordString(),
                components: [counter.getButtons()],
                fetchReply: true
            });
            counter.messageID = newMessage.id;
            await counter.save();
            await interacted.delete()
        }else{
            await interaction.reply({
                content: "Whoops, you don't have access to this counter",
                ephemeral: true
            })
        }
    }

}