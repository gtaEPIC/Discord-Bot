import ytdl = require("ytdl-core");
import Downloaders from "./Downloaders";
import * as stream from "stream";

export default class YouTube extends Downloaders{
    async download(url, point): Promise<stream.Readable> {
        return ytdl(url, {
            filter: "audio",
            quality: "lowestaudio",
            begin: point,
            highWaterMark: 1<<25
        })
    }
}