import LumaClient from '../../client';
import EmbedColors from '../../lib/colors';
import Command from '../../lib/command'
import * as Discord from 'discord.js';
import { evaluate } from 'mathjs'
import { replaceAll } from '../../lib/string'

export default class implements Command {
    public name: string = 'calc'
    public description: string = 'Resolve expressões matemáticas'
    public usage: string = '<expressão>'
    public aliases: string[] = []
    public priviledge: string[] = []

    public async run (client: LumaClient, msg: Discord.Message, args: string[]) : Promise<void> {
        // Calcular a expressão
        let exp: string = args.join(' ') || '0'
        let res: string = '-'
        
        try {
            res = evaluate(exp).toString()
        } catch(ex) {
            res = `*MATH ERROR : ${ex.message}*`
        }

        let emb: Discord.RichEmbed = new Discord.RichEmbed()
        emb.setTitle(`${res}`)
        emb.setFooter(`${replaceAll(exp, '*', '×')}`)
        emb.setColor(EmbedColors.BackgroundEmbed)
        msg.channel.send({ embed: emb })
        return null    
    }
}