import { GuildMember } from "discord.js";
import { leveling } from "../../Config/config.json";
import { database } from "../../Config/auth.json";
import { createPool } from "mysql";

const cooldown: Map<string, any> = new Map();
var connection = createPool(database);

async function addXp(member: GuildMember, isCommand: boolean) {
    if (isCommand) return;
    if (cooldown.has(member.id)) return;
    cooldown.set(member.id, null);
    setTimeout(() => cooldown.delete(member.id), leveling.xp_cooldown_seconds * 1000);
    connection.query("SELECT * FROM users WHERE user = ?", [member.id], (err, users) => {
        if (!users || !users[0]) {
            return connection.query("INSERT INTO users (user, xp) VALUES (?, ?)", [member.id, leveling.xp_per_message])
        }
        let xp: number = parseInt(users[0].xp) + leveling.xp_per_message;
        connection.query("UPDATE users SET xp = ? WHERE user = ?", [xp, member.id]);
    })
}

function getXp(member: GuildMember) {
    return new Promise<number>((resolve, reject) => {
        connection.query("SELECT * FROM users WHERE user = ?", [member.id], (err, users) => {
            let xp: number = 0;
            if (users && users[0] && users[0].xp) {
                xp = parseFloat(users[0].xp);
            }
            resolve(xp);
        });
    })
}

function getLeaderboard() {
    return new Promise<any>((resolve, reject) => {
        connection.query("SELECT * FROM users", async (err, users: Array<any>) => {
            if (!users || !users[0]) {
                resolve("No users found")
            }

            let leaderboard: Array<string> = [];
            let xp = [];
            let count = 1;

            for (var i = 0; i < users.length; i++) {
                xp.push(parseInt(users[i].xp));
            }

            xp = sortXpArray(xp).reverse();
            for (let i = 0; i < xp.length; i++) {
                for (let o = 0; o < users.length; o++) {
                    if (xp[i] == users[o].xp) {
                        if (!leaderboard.find(r => r.includes(users[o].user))) {
                            leaderboard.push(`**${count}.** <@${users[o].user}>: ${xp[i]}xp`);
                            count++;
                        }
                    }
                }
            }

            resolve(leaderboard.join("\n"))
        })
    })
}

function sortXpArray(array: Array<number>) {
    var temp = 0;
    for (var i = 0; i < array.length; i++) {
        for (var o = i; o < array.length; o++) {
            if (array[o] < array[i]) {
                temp = array[o];
                array[o] = array[i];
                array[i] = temp;
            }
        }
    }
    return array;
}

function getLevel(xp: number) {
    return new Promise<number>((resolve, reject) => {
        if (xp == 0 || xp == null) {
            return resolve(0);
        }

        let level: number = 0;

        for (let i = 0; i < xp + 1; i++) {
            if (i !== 0 && i % leveling.xp_for_oneLevel == 0) {
                level++;
            }
        }
        resolve(level)
    })
}

export {
    addXp,
    getXp,
    getLeaderboard,
    getLevel
}