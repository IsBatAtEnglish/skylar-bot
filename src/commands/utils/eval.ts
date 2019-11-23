import LumaClient from '../../client';
import EmbedColors from '../../lib/colors';
import Command from '../../lib/command'
import * as Discord from 'discord.js';
import { inspect } from 'util'

export default class implements Command {
    public name: string = 'eval'
    public description: string = 'Executa JavaScript'
    public usage: string = '<código>'
    public aliases: string[] = []
    public priviledge: string[] = ['BOT_OWNER']

    public async run (client: LumaClient, msg: Discord.Message, args: string[]) : Promise<void> {
        let evaled;

        try {
            evaled = await eval(`(async () =>  ${args.join(' ') } )()`);
        }
        catch (error) {
            evaled = error
        }

        let emb: Discord.RichEmbed = new Discord.RichEmbed()
        emb.setDescription(`\`\`\`${inspect(evaled)}\`\`\``)
        emb.setColor(EmbedColors.BackgroundEmbed)
        msg.channel.send({ embed: emb })
        return null    
    }
}