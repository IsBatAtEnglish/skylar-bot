import * as Discord from 'discord.js'
import log from './logger'
import chalk from 'chalk'
import Settings from './settings'
import { CommandHandler } from './commands';
import * as SQLite from "better-sqlite3"

class Client {
    public discord: Discord.Client
    public db: SQLite.Database
    public settings: Settings
    private token: string
    private commandHandler: CommandHandler

    constructor (settings_file: string) {
        this.settings = new Settings(settings_file)
        this.discord = new Discord.Client()
        this.db = new SQLite(this.settings.value('db_name') || '../db/luma.db')
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
    
        this.initDB()

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
        let id = this.discord.user.id
        this.discord.user.setActivity('Digite ::ajuda meu chapa')

        // Aumentar o contador de logins do bot
        this.db.prepare(`INSERT OR REPLACE into bot_stats (id, login_counter) VALUES (
            ?,
            COALESCE((SELECT login_counter FROM bot_stats WHERE id = ?), 0) + 1
        )`).run(id, id)
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

    private initDB() : void {
        this.db.exec(`CREATE TABLE IF NOT EXISTS bot_stats (
            id CHAR(32) PRIMARY KEY UNIQUE DEFAULT 0,
            login_counter INTEGER DEFAULT 0,
            commands_executed_counter INTEGER DEFAULT 0
        )`)
    }
}

export { Client }