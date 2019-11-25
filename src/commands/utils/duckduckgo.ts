import LumaClient from '../../client';
import Command from '../../lib/command'
import * as Discord from 'discord.js';

import axios from 'axios'
import cheerio from 'cheerio'

export default class implements Command {
    public name: string = 'ddg'
    public description: string = 'Pesquisa no DuckDuckGo'
    public usage: string = '<pesquisa>'
    public aliases: string[] = ['g', 'google']
    public priviledge: string[] = []

    public async run (client: LumaClient, msg: Discord.Message, args: string[]) : Promise<void> {
        let query: string = args.join(' ')
        if (!query) {
            msg.reply('*nenhum termo de pesquisa especificado*')
            return
        }
    
        const body = await axios.get('https://duckduckgo.com/html/', {
            params: {
                'q': query,
                't': 'h_',
                'ia': 'web'
            },
            headers: {
                'cookie': 'ax=v197-3; ad=pt_BR; l=br-pt',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/78.0.3904.108 Safari/537.36'
            }
        })

        const $ = cheerio.load(body.data)
        const link = $('.result__snippet').attr('href')
        
        if (!link) {
            msg.reply('*nenhum resultado encontrado*')
            return
        }

        msg.reply(link)
    }
}