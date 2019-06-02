import { Command, CommandHandler } from "../../commands";
import { Client } from "../../client";
import * as Discord from "discord.js";
import Icons from "../../util/icons";

export default class implements Command {
    public name: string = 'ping'
    public description: string = 'Mostra o ping do bot'
    public aliases: Array<string> = []
    public priviledge: Array<string> = []

    public async run (client: Client, handler: CommandHandler, msg: Discord.Message) : Promise<void> {
        msg.reply(`${Icons.Clock} Pong — levou **${client.discord.ping}ms**!`)
        return null    
    }
}