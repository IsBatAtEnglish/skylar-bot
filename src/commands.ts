import { readdirSync } from 'fs'
import { join, resolve } from 'path'
import { Message, User } from 'discord.js'
import Command from './lib/command'
import Client from './client'
import log from './lib/logger';
import chalk from 'chalk';
import recursive from 'recursive-readdir';

class CommandManager {
    private client: Client // Cliente que pertence este handler

    public commandPath: string  = ''
    public commands: Command[]  = []
    public prefix: string       = 'c.'

    constructor (client: Client) {
        this.client = client
        this.prefix = this.client.conf.get('prefix')
        this.commandPath = resolve(__dirname, './commands/')

        this.loadAll()
    }

    public async loadAll() : Promise<void> {
        // Limpar os comandos já carregados
        this.commands.length = 0

        const files: string[] = await recursive(this.commandPath)

        for (let file of files) {
            let Command = await import(file)
            let cmd = new Command.default()
            this.commands.push(cmd)
            log('carregado:', cmd.name, file)
        }
    }

    public async onMessage(msg: Message) : Promise<void> {
        let prefix = this.client.conf.get('prefix')

        const args = msg.content.split(' ')
        const cmd_id = args
            .shift()
            .replace(prefix, '')

        // Pegar o comando correspondente ao ID através de seu nome
        // ou de um alias
        const cmd = this.commands.find(cmd => 
            cmd.name === cmd_id || cmd.aliases.includes(cmd_id))

        if (!cmd) return null
        
        // Validar permissões
        const ownerOnly: boolean = cmd.priviledge.includes('BOT_OWNER')
        if (ownerOnly && msg.author.id !== this.client.conf.get('owner'))
            return null
            
        cmd.run(this.client, msg, args)
            .catch(ex => {
                log(chalk.red(`❌  Erro no comando ${chalk.blue(cmd.name)}!`))
                // @ts-ignore
                log(`Guild: ${msg.guild ? chalk.blue(msg.guild.name) : chalk.red('Não')}`)
                log(`Mensagem: ${msg.cleanContent}`)
                log(ex.stack)
                msg.reply(`*houve um erro ao executar esse comando -- \`${ex.name}\`*`)
            })

        // Incrementar o contador de comandos
        let count = await this.client.db.get(`
            INSERT INTO stats (id, command_count) 
            VALUES (?, ?) 
            ON CONFLICT (id)
            DO UPDATE SET command_count = command_count + 1
        `, this.client.client.user.id, 1)
    }
}

export default CommandManager