import { Command, CommandHandler } from "../../commands";
import { Client } from "../../client";
import * as Discord from "discord.js";

export default class implements Command {
    public name: string = 'ajuda'
    public description: string = 'Mostra a lista de comandos'
    public aliases: Array<string> = ['help', 'h']
    public priviledge: Array<string> = []

    public async run (client: Client, handler: CommandHandler, msg: Discord.Message) : Promise<void> {
        const emb = new Discord.RichEmbed()
        
        for (const command of handler.commands) {
            emb.addField(command.name, `${command.description}\nAliases: \`${command.aliases.join(' ') || '-'}\``)
        }

        msg.reply(emb)

        return null    
    }
}