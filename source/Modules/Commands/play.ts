import { Client, Message, TextChannel } from "discord.js";
import { Embed } from "../../Util/Embed";
import { play } from "../../Util/MusicManager";

export const name: string = "play";
export const run = async(client: Client, message: Message, args: string[]) => {
    const songUrl = args.join(" ");

    if(!songUrl) {
        return message.channel.send(new Embed({
            title: "Error",
            description: "Missing argument songURL."
        }))
    }

    if(!message.member.voice.channel) {
        return message.channel.send(new Embed({
            title: "Error",
            description: "Please join a voice channel, and retry this command."
        }))
    }

    play(message.channel as TextChannel, message.member.voice.channel, songUrl);
}