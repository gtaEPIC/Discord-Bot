import ytdl = require("@distube/ytdl-core");
import Downloaders from "./Downloaders";
import * as stream from "stream";

export default class YouTube extends Downloaders{
    async download(url, point): Promise<stream.Readable> {
        return ytdl(url, {
            filter: "audio",
            quality: "lowestaudio",
            begin: point,
            highWaterMark: 1<<25,
            liveBuffer: 40000,
            requestOptions: {
                headers: {
                    cookie: process.env.YTDL_COOKIE || ""
                }
            }
        })
    }
}