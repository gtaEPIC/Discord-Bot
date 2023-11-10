import mongoose from "mongoose";
require("dotenv").config();

export default function setup() {
	mongoose.connect(process.env.MONGO_URL).then(() => {
		console.log("Connected to MongoDB");
	}).catch((err) => {
		console.error("Failed to connect to MongoDB");
		console.error(err);
		process.exit(1);
	});
}