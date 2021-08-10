import { runCommand } from "../../Interfaces/types";
import { normalEmbed } from "../Utils/embed";
import { getLeaderboard } from "../Utils/xpManager";

export const name: string = "leaderboard";
export const run: runCommand = async(client, guild, channel, member, message, args) => {
    channel.send({embeds: [normalEmbed({
        title: "Leaderboard",
        description: await getLeaderboard()
    })]})
}