import { GuildMember } from "discord.js";
import { runCommand } from "../../Interfaces/types";
import { getLevel, getXp } from "../Utils/xpManager";
import { normalEmbed } from "../Utils/embed";

export const name: string = "level";
export const run: runCommand = async(client, guild, channel, member, message, args) => {
    const user: GuildMember = message.mentions.members.first() || member;

    const xp: number = await getXp(user);
    const level: number = await getLevel(xp);

    channel.send({embeds: [normalEmbed({
        title: `Levels for ${user.user.username}`,
        description: `The user has ${xp}xp, with a level of ${level}`,
        thumbnail: {
            url: user.user.displayAvatarURL()
        }
    })]});
}