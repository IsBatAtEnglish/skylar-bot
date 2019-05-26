import { readdirSync } from 'fs'
import * as path from 'path'
import { Message, User } from 'discord.js'
import { Client } from './client'
import log from './logger';
import chalk from 'chalk';

interface Command {
    name: string
    aliases: Array<string>
    priviledge: Array<string>
    run (client: Client, handler: CommandHandler, msg: Message): Promise<void>
}

class CommandHandler {
    private client: Client // Cliente que pertence este handler

    public commandPath: string = './'
    public commands: Array<Command> = []
    public prefix: string

    constructor (client: Client) {
        this.client = client
        this.prefix = this.client.settings.value('prefix')
        this.commandPath = this.client.settings.value('command_path')
    }

    public async loadAll(): Promise<CommandHandler> {
        // Limpar os comandos já carregados
        this.commands.length = 0

        const files: Array<string> = readdirSync(this.commandPath)

        for (let file of files) {
            // Corrigir o caminho do comando
            file = path.join(__dirname, this.commandPath, file)

            try {
                // Importa a classe de cada comando e as inicializa
                const cmd = new (await import(file)).default()
                this.commands.push(cmd)
            } catch (ex) {
                log(chalk.red(`Erro ao carregar o comando ${chalk.blue(file)}.`))
                log(ex)
                // Não deu para carregar esse comando, mas continuar carregando o resto
                continue;
            }
        }

        return this
    }

    public async onMessage(msg: Message) {
        if (!msg.content.startsWith(this.prefix)) return null

        const args = msg.content.split(' ')
        const cmd_id = args
            .shift()
            .replace(this.prefix, '')

        const cmd = this.commands.find(cmd => 
            cmd.name === cmd_id || cmd.aliases.includes(cmd_id))

        cmd.run(this.client, this, msg)
            .catch(ex => {
                msg.reply('Erro ao executar o comando.')
                    .catch(() => { /* wtf? */ })
            })
    }
}

export { Command, CommandHandler }