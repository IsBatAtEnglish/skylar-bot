import LumaClient from '../../client';
import EmbedColors from '../../lib/colors';
import Command from '../../lib/command'
import * as Discord from 'discord.js';
import { inspect } from 'util'
import { execSync } from 'child_process'

export default class implements Command {
    public name: string = 'shell'
    public description: string = 'Executa shell script'
    public usage: string = '<shell script>'
    public aliases: string[] = ['sh']
    public priviledge: string[] = ['BOT_OWNER']

    public async run (client: LumaClient, msg: Discord.Message, args: string[]) : Promise<void> {
        let out;

        try {
            out = execSync(args.join(' '))
        } catch(ex) {
            out = inspect(ex)
        }

        let emb: Discord.RichEmbed = new Discord.RichEmbed()
        emb.setDescription(`\`\`\`${out}\`\`\``)
        emb.setFooter(args.join(' '))
        emb.setColor(EmbedColors.BackgroundEmbed)
        msg.channel.send({ embed: emb })
        return null    
    }
}