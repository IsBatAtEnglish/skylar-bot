import * as Discord from 'discord.js'
import log from './logger'
import chalk from 'chalk'
import Settings from './settings'
import { CommandHandler } from './commands';

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
    public start() : void {
        const start = Date.now()
        this.discord.login(this.token)
            .then(() => {
                const end = Date.now()
                log(`${chalk.green('Login concluído.')} (levou ${chalk.blue(`${end - start}ms`)})`)
                this.postLogin()
            })
            .catch(ex => {
                log(chalk.redBright('!!! ERRO AO INICIAR O CLIENTE !!!'))
                log(chalk.red('Mais detalhes:'))
                log('\n\n', chalk.redBright(ex.stack), '\n')
                log(chalk.red('O processo do bot será terminado.'))
                process.exit(1)
            })
    }

    public postLogin() : void {
        this.discord.user.setActivity('::ping')
    }

    /**
     * Executado quando uma mensagem é recebida.
     * @param msg Mensagem recebida
     */
    private onMessage (msg: Discord.Message) : void {
        if (msg.author.bot) return null
        
        const prefix: string = this.settings.value('prefix')

        const author: Discord.User = msg.author
        const content: string = msg.content

        log(`Mensagem ~ ${chalk.blue(author.tag)}:\n${chalk.red('->')} ${content}`)

        this.commandHandler.onMessage(msg)
    }
}

export { Client }