import Downloaders from "./Downloaders";
import * as stream from "stream";
import scdl from "soundcloud-downloader";

export default class SoundCloud extends Downloaders{

    download(url, point): Promise<stream.Readable> {
        return scdl.download(url);
    }
}