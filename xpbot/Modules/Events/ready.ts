import { runEvent } from "../../Interfaces/types";

export const name: string = "ready";
export const run: runEvent = async(client) => {
    console.log(`Logged in as ${client.user.tag}`);
}