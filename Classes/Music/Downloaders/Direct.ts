import Downloaders from "./Downloaders";
import * as stream from "stream";
import * as fs from "fs";

export default class Direct extends Downloaders {
    download(url, point): Promise<stream.Readable> {
        // Download the file using axios
        return new Promise((resolve, reject) => {


        });
        // return new Promise((resolve, reject) => {
        //     axios.get(url).then(res => {
        //         console.log(res)
        //         resolve();
        //         // if (res.headers["content-type"] === "audio/mpeg") {
        //         //     resolve(res.data);
        //         // } else {
        //         //     reject(new Error("Invalid Content-Type"));
        //         // }
        //     })
        // });
    }
}