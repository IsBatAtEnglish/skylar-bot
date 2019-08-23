import { Command, CommandHandler } from "../../commands";
import { Client } from "../../client";
import * as Discord from "discord.js";
import EmbedColors from "../../util/colors";

export default class implements Command {
    public name: string = 'ajuda'
    public description: string = 'Mostra a lista de comandos'
    public usage: string = ''
    public aliases: Array<string> = ['help', 'h']
    public priviledge: Array<string> = []

    public async run (client: Client, handler: CommandHandler, msg: Discord.Message) : Promise<void> {
        const emb = new Discord.RichEmbed()
            .setColor(EmbedColors.Indigo)
            
        for (const command of handler.commands) {
            let name = client.settings.value('prefix') + command.name
            let field = `${command.description}\n`
            if (command.usage) name += ` *${command.usage}*`
            if (command.aliases.length > 0) field += `Outros nomes: \`${command.aliases.join(' ')}\``
            emb.addField(name, field)
        }

        msg.reply(emb)

        return null    
    }
}