import { Client, Collection, Intents } from "discord.js";
import glob from "glob";
import { promisify } from "util";
import { prefix, token } from "./Config/config.json"; 

const readFiles = promisify(glob);
const client = new Client({
    ws: {
        intents: Intents.ALL
    }
});

const commands = new Collection();

(async() => {
    const commandFiles = await readFiles(process.cwd() + `/Modules/Commands/**/*{.ts,.js}`);
    commandFiles.map(async(value: string) => {
        const file: any = await import(value);
        commands.set(file.name, file);
    })
})()

client.on("message", message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    
    const args: string[] = message.content.substr(prefix.length).split(" ");
    const command: any = commands.get(args.shift().toLowerCase());
    if(!command) return;
    command.run(client, message, args);
});

client.login(token);

client.on("ready", () => {
    console.log("Logged in.")
})