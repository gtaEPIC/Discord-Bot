import Downloaders from "./Downloaders";
import * as stream from "stream";
import {Innertube, Log, Platform, Types, UniversalCache, Utils} from "youtubei.js";

Platform.shim.eval = async (data: Types.BuildScriptResult, env: Record<string, Types.VMPrimative>) => {
    const properties = [];

    if(env.n) {
        properties.push(`n: exportedVars.nFunction("${env.n}")`)
    }

    if (env.sig) {
        properties.push(`sig: exportedVars.sigFunction("${env.sig}")`)
    }

    const code = `${data.output}\nreturn { ${properties.join(', ')} }`;

    return new Function(code)();
}

Log.setLevel(Log.Level.DEBUG);

export default class YouTube extends Downloaders{
    async download(url, point): Promise<stream.Readable> {
        const videoId = new URL(url).searchParams.get("v");
        if (!videoId) throw new Error("Invalid YouTube URL: missing 'v' parameter");

        const yt = await Innertube.create({
            cache: new UniversalCache(false),
            generate_session_locally: true,
            cookie: process.env.YTDL_COOKIE || ""
        });

        // Use the download method with videoId instead of full URL
        const videoInfo = await yt.getBasicInfo(videoId);
        const streamInfo = await videoInfo.download({
            type: "audio",
            // quality: "best",
            // format: "opus",
            client: "WEB",
            range: { start: point || 0, end: undefined }
        })

        // Convert ReadableStream to Node.js Readable stream
        return stream.Readable.from(Utils.streamToIterable(streamInfo));
    }
}