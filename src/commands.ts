import { readdirSync } from 'fs'
import { join } from 'path'
import { Message, User } from 'discord.js'
import { Client } from './client'
import log from './logger';
import chalk from 'chalk';
import * as recursive from 'recursive-readdir';

interface Command {
    name: string
    description: string
    usage: string
    aliases: Array<string>
    priviledge: Array<string>
    run (client: Client, handler: CommandHandler, msg: Message): Promise<void>
}

class CommandHandler {
    private client: Client // Cliente que pertence este handler

    public commandPath: string = './'
    public commands: Array<Command> = []
    public prefix: string = '::'

    constructor (client: Client) {
        this.client = client
        this.prefix = this.client.settings.value('prefix')
        this.commandPath = this.client.settings.value('command_path')
    }

    public async loadAll() : Promise<CommandHandler> {
        // Limpar os comandos já carregados
        this.commands.length = 0

        const files: Array<string> = await recursive(this.commandPath)

        for (let file of files) {
            // Corrigir o caminho do comando
            file = join(__dirname, file)

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

    public async onMessage(msg: Message) : Promise<void> {
        if (!msg.content.startsWith(this.prefix)) return null

        const args = msg.content.split(' ')
        const cmd_id = args
            .shift()
            .replace(this.prefix, '')

        // Pegar o comando correspondente ao ID através de seu nome
        // ou de um alias
        const cmd = this.commands.find(cmd => 
            cmd.name === cmd_id || cmd.aliases.includes(cmd_id))

        if (!cmd) return null
        
        // Validar permissões
        const ownerOnly: boolean = cmd.priviledge.includes('BOT_OWNER')
        if (ownerOnly && msg.author.id !== this.client.settings.value('owner'))
            return null
            
        cmd.run(this.client, this, msg)
            .catch(ex => {
                log(chalk.red(`❌  Erro no comando ${chalk.blue(cmd.name)}!`))
                // @ts-ignore
                log(`Guild: ${msg.guild ? chalk.blue(msg.guild.name) : chalk.red('Não')}`)
                log(`Mensagem: ${msg.cleanContent}`)
                log(ex.stack)
                msg.reply('Erro ao executar o comando.')
                    .catch(() => { /* wtf? */ })
            })
    }
}

export { Command, CommandHandler }