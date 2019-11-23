import { readFileSync } from 'fs'
import { Client, Message } from 'discord.js'
import CommandManager from './commands'
import log from './lib/logger'

class LumaClient {
    public conf:    Map<string, any>    = new Map
    public client:  Client              = new Client
    public cmdMngr: CommandManager      = new CommandManager(this)
    
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
        this.client.login(this.conf.get('auth'))
            .then(async () => {
                let dt = Math.floor(Date.now() - t0)
                log(`Login feito em ${dt}ms`)
            })
    }
}

export default LumaClient