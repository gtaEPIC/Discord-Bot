import mongoose from 'mongoose';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from "discord.js";

export interface CounterData {
	_id: mongoose.Types.ObjectId;
	seq: number;
	owner: string;
	content: string;
	messageID: string;
}

const CounterSchema = new mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	seq: Number,
	owner: String, // Discord ID
	content: String,
	messageID: String,
});
export const CounterModel = mongoose.model<CounterData>('Counter', CounterSchema);

export default class Counter implements CounterData {
	_id: mongoose.Types.ObjectId;
	content: string;
	messageID: string;
	owner: string;
	seq: number;

	constructor(data: CounterData) {
		this._id = data._id;
		this.content = data.content;
		this.messageID = data.messageID;
		this.owner = data.owner;
		this.seq = data.seq;
	}

	static async create(owner: string, content: string, messageID: string, startingNumber: number = 0): Promise<Counter> {
		const counter = new Counter({
			_id: null,
			seq: startingNumber,
			owner,
			content,
			messageID,
		});
		await counter.save();
		return counter;
	}

	async save() {
		let newModel = new CounterModel(this);
		if (!this._id) {
			newModel.isNew = true;
			newModel._id = new mongoose.Types.ObjectId();
		}else{
			newModel.isNew = false;
		}
		await newModel.save();
		this._id = newModel._id;
	}

	static async fetchById(id: mongoose.Types.ObjectId): Promise<Counter> {
		const model = await CounterModel.findById(id);
		return new Counter(model);
	}
	static async fetchByDiscordMessageId(messageId: string): Promise<Counter> {
		const model = await CounterModel.findOne({messageID: messageId});
		return new Counter(model);
	}

	async increment(): Promise<void> {
		this.seq++;
		await this.save();
	}
	async decrement(): Promise<void> {
		this.seq--;
		await this.save();
	}

	toDiscordString(): string {
		return this.content + ": " + this.seq + "\n" + (this.owner ? "Only <@" + this.owner + "> can use this" :
			"Anyone can use this");
	}

	getButtons(): ActionRowBuilder<ButtonBuilder> {
		let actionRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>();
		let addButton: ButtonBuilder = new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId("counter+=+add").setLabel("+1");
		let removeButton: ButtonBuilder = new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId("counter+=+remove").setLabel("-1");
		actionRow.addComponents(addButton, removeButton);
		return actionRow;
	}

}