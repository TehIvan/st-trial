import { Client, Message, TextChannel } from "discord.js";
import { Embed } from "../../Util/Embed";
import { pause } from "../../Util/MusicManager";

export const name: string = "pause";
export const run = async(client: Client, message: Message, args: string[]) => {

    if(!message.member.voice.channel) {
        return message.channel.send(new Embed({
            title: "Error",
            description: "Please join a voice channel, and retry this command."
        }))
    }

    pause(message.channel as TextChannel, message.member.voice.channel);
}