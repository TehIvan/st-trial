import { Message, TextChannel } from "discord.js";
import { Command, runEvent } from "../../Interfaces/types";
import { prefix } from "../../Config/config.json";
import { commands } from "../..";
import { addXp } from "../Utils/xpManager";

export const name = "messageCreate";
export const run: runEvent = async (client, message: Message) => {
    if (message.author.bot) return;
    await addXp(message.member, message.content.startsWith(prefix));
    if (!message.content.startsWith(prefix)) return;

    const args: string[] = message.content.substr(prefix.length).split(" ");
    const command: Command = commands.get(args.shift().toLowerCase());

    if(!command) return;
    command.run(client, message.guild, message.channel as TextChannel, message.member, message, args);
}