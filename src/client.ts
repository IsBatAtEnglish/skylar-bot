import { readFileSync } from 'fs'
import { Client, Message } from 'discord.js'
import { Database } from 'sqlite'
import CommandManager from './commands'
import connectDatabase from './database'
import log from './lib/logger'

class LumaClient {
    public conf:    Map<string, any>    = new Map
    public client:  Client              = new Client
    public cmdMngr: CommandManager      = new CommandManager(this)
    public db: Database                 = null

    constructor () {
        let sett = JSON.parse(readFileSync('./settings.json', 'utf8'))
        Object.keys(sett).forEach(k =>
            this.conf.set(k, sett[k] ))

        this.client.on('message', msg =>
            this.messageCreate(msg))
    }

    // Executado quando uma mensagem é recebida.
    async messageCreate(msg: Message) : Promise<void> {
        let content: string = msg.content
        let prefix: string = this.conf.get('prefix')

        if (!content.startsWith(prefix) || msg.author.bot) return

        this.cmdMngr.onMessage(msg)
    }

    async start() : Promise<void> {
        let t0 = Date.now()
        this.db = await connectDatabase(this.conf)
        let t1 = Date.now()

        log(`Conexão com o banco de dados realizada em ${t1 - t0}ms`)

        this.client.login(this.conf.get('auth'))
            .then(async () => {
                log(`Login feito em ${Date.now() - t1}ms`)

                // Incrementar o contador de logins
                await this.db.run(`
                    INSERT INTO stats (id, login_count) 
                    VALUES (?, ?) 
                    ON CONFLICT (id)
                    DO UPDATE SET login_count = login_count + 1
                `, this.client.user.id, 1)

                let { login_count } = await this.db.get(`SELECT login_count FROM stats WHERE id = ?`, this.client.user.id)
                this.client.user.setActivity(`n° de logins: ${login_count}`)
            })
            .catch(e => {
                log(`Erro ao fazer login: ${e}`)
                this.start() // tentar novamente
            })
    }
}

export default LumaClient