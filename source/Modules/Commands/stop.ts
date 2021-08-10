import { Client, Message, TextChannel } from "discord.js";
import { Embed } from "../../Util/Embed";
import { stop } from "../../Util/MusicManager";

export const name: string = "stop";
export const run = async(client: Client, message: Message, args: string[]) => {

    if(!message.member.voice.channel) {
        return message.channel.send(new Embed({
            title: "Error",
            description: "Please join a voice channel, and retry this command."
        }))
    }

    stop(message.channel as TextChannel, message.member.voice.channel);
}