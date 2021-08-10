import { Client, Collection } from "discord.js";
import { token, database } from "./Config/auth.json";
import { promisify } from "util";
import { Command, Event } from "./Interfaces/types";
import { createPool } from "mysql";
import glob from "glob";

const readFiles = promisify(glob);
const commands: Collection<string, Command> = new Collection();
const cooldowns: Map<string, any> = new Map();

var connection = createPool(database);

const client: Client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"]
});

(async() => {
    connection.query("INSERT INTO users (user, xp) VALUES (?, ?)", ["568441484026839050", 2])
    connection.query("CREATE TABLE IF NOT EXISTS users (user text, xp int)", (err) => {
        if(err) throw err;
    });

    const commandFiles: string[] = await readFiles(`${__dirname}/Modules/Commands/**/*{.ts,.js}`);
    const eventFiles: string[] = await readFiles(`${__dirname}/Modules/Events/**/*{.ts,.js}`);    

    commandFiles.map(async(value: string) => {
        const file: Command = await import(value);
        commands.set(file.name, file);
    })

    eventFiles.map(async(value: string) => {
        const file: Event = await import(value);
        client.on(file.name, file.run.bind(null, client));
    });
})()

client.login(token);

export {
    commands,
    cooldowns
}