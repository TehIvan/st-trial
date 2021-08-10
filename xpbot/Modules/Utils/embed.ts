import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import { footer, color } from "../../Config/config.json";

export function normalEmbed(opt: MessageEmbedOptions) {
    return new MessageEmbed(opt).setColor(!opt.color ? color as any : opt.color).setFooter(!opt.footer || !opt.footer.text ? footer : opt.footer.text);
}