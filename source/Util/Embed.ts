import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import { color, footer } from "../Config/config.json"

export class Embed extends MessageEmbed {
    constructor(opt: MessageEmbedOptions) {
        super(opt);
        this.color = color as any;
        this.footer = {
            text: footer
        }
    }
}