import { Command, CommandHandler } from "../../commands";
import { Client } from "../../client";
import * as Discord from "discord.js";
import * as MathJS from "mathjs"
import Icons from "../../util/icons";
import { replaceAll } from "../../util/string"
import EmbedColors from "../../util/colors";

export default class implements Command {
    public name: string = 'calc'
    public description: string = 'Uma calculadora!'
    public usage: string = '<continha>'
    public aliases: Array<string> = []
    public priviledge: Array<string> = []

    public async run (client: Client, handler: CommandHandler, msg: Discord.Message, args: Array<string>) : Promise<void> {
        // Calcular a expressão
        let exp: string = args.join(' ') || '0'
        let res: string = 'Erro ao calcular a expressão.'
        
        try {
            res = MathJS.evaluate(exp).toString()
        } catch(ex) {
            // Ignorar erro
        }

        let emb: Discord.RichEmbed = new Discord.RichEmbed()
        emb.setTitle(`${res}`)
        emb.setFooter(`${replaceAll(exp, '*', '×')}`, `http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/calculator-icon.png`)
        emb.setColor(EmbedColors.Purple)
        msg.channel.send({ embed: emb })
        return null    
    }
}