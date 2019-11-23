import { readFileSync } from 'fs'
import { Client, Message } from 'discord.js'
import CommandManager from './commands'
import log from './lib/logger'
import Keyv from 'keyv'

class LumaClient {
    public conf:    Map<string, any>    = new Map
    public client:  Client              = new Client
    public cmdMngr: CommandManager      = new CommandManager(this)
    public db_science: Keyv

    constructor () {
        let sett = JSON.parse(readFileSync('./settings.json', 'utf8'))
        Object.keys(sett).forEach(k =>
            this.conf.set(k, sett[k] ))

        // Inicializar o banco de dados
        this.db_science = new Keyv(this.conf.get('db_url'), { namespace: 'science' })

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

        this.client.login(this.conf.get('auth'))
            .then(async () => {
                let dt = Math.floor(Date.now() - t0)
                log(`Login feito em ${dt}ms`)

                // Atualizar número de logins no banco de dados
                let login_count = 
                    await this.db_science.get('login_count') || 0
                await this.db_science.set('login_count', login_count + 1)

                this.client.user.setActivity(`n° de logins: ${login_count + 1}`)
            })
            .catch(() => this.start()) // tentar novamente
    }
}

export default LumaClient