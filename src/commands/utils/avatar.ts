import LumaClient from '../../client';
import EmbedColors from '../../lib/colors';
import Icons from '../../lib/icons'
import Command from '../../lib/command'
import * as Discord from 'discord.js';

export default class implements Command {
    public name: string = 'avatar'
    public description: string = 'Mostra o avatar'
    public usage: string = '@usuário'
    public aliases: string[] = []
    public priviledge: string[] = []

    public async run (client: LumaClient, msg: Discord.Message, args: string[]) : Promise<void> {
        let usr: Discord.User = msg.mentions.users.first() || msg.author
        let emb = new Discord.RichEmbed()

        emb.setTitle(`${Icons.Picture} Avatar de ${usr.tag}`)
        emb.setColor(EmbedColors.Indigo)
        emb.setImage(usr.displayAvatarURL)

        msg.reply({ embed: emb })
        return null    
    }
}