import { Command, CommandHandler } from "../../commands";
import { Client } from "../../client";
import * as Discord from "discord.js";
import Icons from "../../util/icons";
import EmbedColors from "../../util/colors";

export default class implements Command {
    public name: string = 'avatar'
    public description: string = 'Mostra o avatar'
    public usage: string = '@usuário'
    public aliases: Array<string> = []
    public priviledge: Array<string> = []

    public async run (client: Client, handler: CommandHandler, msg: Discord.Message) : Promise<void> {
        let usr: Discord.User = msg.mentions.users.first() || msg.author
        let emb = new Discord.RichEmbed()

        emb.setTitle(`${Icons.Picture} Avatar de ${usr.tag}`)
        emb.setColor(EmbedColors.Indigo)
        emb.setImage(usr.displayAvatarURL)

        msg.reply({ embed: emb })
        return null    
    }
}