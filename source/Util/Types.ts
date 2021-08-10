import { VoiceConnection } from "discord.js";
import ytdl from "ytdl-core";

interface Queue {
    songs: ytdl.videoInfo[];
    connection: VoiceConnection;
}

export {
    Queue
}