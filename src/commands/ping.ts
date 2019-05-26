import { Command, CommandHandler } from "../command";
import { Client } from "../client";
import * as Discord from "discord.js";

export default class implements Command {
    public name: string = 'ping'
    public description: string = 'Mostra o ping do bot'
    public aliases: Array<string> = []
    public priviledge: Array<string> = []

    public async run (client: Client, handler: CommandHandler, msg: Discord.Message) : Promise<void> {
        msg.reply(`${client.discord.ping}ms`)
        return null    
    }
}