import LumaClient from '../../client';
import EmbedColors from '../../lib/colors';
import Icons from '../../lib/icons'
import Command from '../../lib/command'
import * as Discord from 'discord.js';

export default class implements Command {
    public name: string = 'ping'
    public description: string = 'Mostra o ping do bot'
    public usage: string = ''
    public aliases: string[] = []
    public priviledge: string[] = []

    public async run (client: LumaClient, msg: Discord.Message, args: string[]) : Promise<void> {
        msg.reply(`${Icons.Clock} Pong — levou **${Math.floor(client.client.ping)}ms**!`)
        return null    
    }
}