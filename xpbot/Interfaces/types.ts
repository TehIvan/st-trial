import { Client, Guild, GuildMember, Message, TextChannel } from "discord.js";

interface runEvent {
    (client: Client, ...args: any): Promise<any>
}

interface Event {
    name: string;
    run: runEvent;
}

interface runCommand {
    (client: Client, guild: Guild, channel: TextChannel, member: GuildMember, message: Message, args: string[]): Promise<any>
}

interface Command {
    name: string;
    roles: string[];
    run: runCommand;
}

export {
    runEvent,
    Event,
    runCommand,
    Command
}