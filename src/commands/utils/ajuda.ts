import LumaClient from '../../client';
import EmbedColors from '../../lib/colors';
import Command from '../../lib/command'
import * as Discord from 'discord.js';

export default class implements Command {
    public name: string = 'ajuda'
    public description: string = 'Mostra a lista de comandos'
    public usage: string = ''
    public aliases: string[] = ['help', 'h']
    public priviledge: string[] = []

    public async run (client: LumaClient, msg: Discord.Message, args: string[]) : Promise<void> {
        const emb = new Discord.RichEmbed()
            .setColor(EmbedColors.Indigo)
            
        for (const command of client.cmdMngr.commands) {
            let name = client.conf.get('prefix') + command.name
            let field = `${command.description}\n`
            if (command.usage) name += ` *${command.usage}*`
            if (command.aliases.length > 0) field += `Outros nomes: \`${command.aliases.join(' ')}\``
            emb.addField(name, field)
        }

        msg.reply(emb)

        return null    
    }
}