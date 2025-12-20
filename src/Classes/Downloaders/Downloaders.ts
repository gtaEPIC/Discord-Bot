import * as stream from "stream";

export default abstract class Downloaders {
    abstract download(url, point): Promise<stream.Readable>;
}