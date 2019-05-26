import * as Discord from 'discord.js'
import log from './logger'
import chalk from 'chalk'
import Settings from './settings'
import { CommandHandler } from './command';

class Client {
    public discord: Discord.Client
    public settings: Settings
    private token: string
    private commandHandler: CommandHandler

    constructor (settings_file: string) {
        this.settings = new Settings(settings_file)
        this.discord = new Discord.Client()
        this.token = this.settings.value('auth')
        this.commandHandler = new CommandHandler(this)

        this.commandHandler.loadAll()

        this.discord.on('message', msg => this.onMessage(msg))
    }

    /**
     * start
     * @description Inicia o cliente
     */
    public async start(): Promise<void> {
        const start = Date.now()
        await this.discord.login(this.token)
        const end = Date.now()
        log(`${chalk.green('Login concluído.')} (levou ${chalk.blue(`${end - start}ms`)})`)
    }

    /**
     * Executado quando uma mensagem é recebida.
     * @param msg Mensagem recebida
     */
    private onMessage (msg: Discord.Message) {
        const prefix: string = this.settings.value('prefix')

        const author: Discord.User = msg.author
        const content: string = msg.content

        log(`Mensagem ~ ${chalk.blue(author.tag)}:\n${chalk.red('->')} ${content}`)

        this.commandHandler.onMessage(msg)
    }
}

export { Client }