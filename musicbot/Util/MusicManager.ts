import { TextChannel, VoiceChannel } from "discord.js";
import ytdl from "ytdl-core";
import { Embed } from "./Embed";
import { Queue } from "./Types";

const queue: Map<string, Queue> = new Map();

async function play(textChannel: TextChannel, voiceChannel: VoiceChannel, songUrl: string, playe?: boolean) {
    let serverQueue: Queue = queue.get(voiceChannel.id);
    if (serverQueue && !playe) {
        serverQueue.songs.push(await ytdl.getBasicInfo(songUrl));
        queue.set(voiceChannel.id, serverQueue);
        textChannel.send(new Embed({
            title: "Added to queue",
            description: (await ytdl.getBasicInfo(songUrl)).videoDetails.title
        }))
    } else {
        const connection = await voiceChannel.join();
        queue.set(voiceChannel.id, {
            connection: connection,
            songs: [await ytdl.getBasicInfo(songUrl)]
        });
        serverQueue = queue.get(voiceChannel.id);
        connection.play(ytdl(await (await ytdl.getBasicInfo(songUrl)).videoDetails.video_url)).on("start", async () => {
            textChannel.send(new Embed({
                title: "Now playing",
                description: (await ytdl.getBasicInfo(songUrl)).videoDetails.title
            }))
        }).on("finish", () => {
            serverQueue.songs.shift();
            if (!serverQueue.songs[0]) {
                return stop(textChannel, voiceChannel);
            }
            play(textChannel, voiceChannel, serverQueue.songs[0].videoDetails.video_url, true)
        });
    }
}

async function stop(textChannel: TextChannel, voiceChannel: VoiceChannel) {
    const serverQueue = queue.get(voiceChannel.id);
    if (!serverQueue) {
        return textChannel.send(new Embed({
            title: "Error",
            description: "Queue does not exist."
        }))
    }
    serverQueue.connection.disconnect();
    queue.delete(voiceChannel.id);
    textChannel.send(new Embed({
        title: "Music Stopped",
        description: "Stopped, and queue cleared."
    }))
}

async function pause(textChannel: TextChannel, voiceChannel: VoiceChannel) {
    const serverQueue = queue.get(voiceChannel.id);
    if (!serverQueue) {
        return textChannel.send(new Embed({
            title: "Error",
            description: "Queue does not exist."
        }))
    }
    serverQueue.connection.dispatcher.pause();
    textChannel.send(new Embed({
        title: "Audio Paused",
        description: "Audio has been paused."
    }))
}

async function resume(textChannel: TextChannel, voiceChannel: VoiceChannel) {
    const serverQueue = queue.get(voiceChannel.id);
    if (!serverQueue || !serverQueue.connection.dispatcher.paused) {
        return textChannel.send(new Embed({
            title: "Error",
            description: "Queue does not exist."
        }))
    }
    serverQueue.connection.dispatcher.resume();
    play(textChannel, voiceChannel, serverQueue.songs[0].videoDetails.video_url, true)
    textChannel.send(new Embed({
        title: "Queue Resumed",
        description: "Queue has been resumed."
    }))
}

async function getQueue(textChannel: TextChannel, voiceChannel: VoiceChannel) {
    const serverQueue = queue.get(voiceChannel.id);
    if (!serverQueue) {
        return textChannel.send(new Embed({
            title: "Error",
            description: "Queue does not exist."
        }))
    }
    let returnStr = `**Queue (${serverQueue.songs.length})**\n`;
    for (let i = 0; i < serverQueue.songs.length; i++) {
        returnStr += `${i + 1}. \`${serverQueue.songs[i].videoDetails.title}\`\n`
    }

    textChannel.send(new Embed({
        description: returnStr
    }))
}

export {
    play,
    stop,
    pause,
    resume,
    getQueue
}