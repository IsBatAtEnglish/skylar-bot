import LumaClient from '../../client';
import Command from '../../lib/command'
import * as Discord from 'discord.js';

import fetch from 'node-fetch'
import ExternalServicesResponse from '../../lib/external.services';

export default class implements Command {
    public name: string = 'google'
    public description: string = 'Procura no Google'
    public usage: string = '<pesquisa>'
    public aliases: string[] = ['g']
    public priviledge: string[] = []

    public async run (client: LumaClient, msg: Discord.Message, args: string[]) : Promise<void> {
        let query: string = args.join(' ')

        let url = `${client.conf.get('external_services_url')}/google`
        let key = client.conf.get('external_services_key')

        if (!query) {
            msg.reply('*Você não especificou um termo de pesquisa! Está com sorte?*')
            return
        }
    
        let r: ExternalServicesResponse = 
            await fetch(`${url}`+
                        `?query=${encodeURIComponent(query)}`+
                        `&key=${encodeURIComponent(key)}`).then(r => r.json())

        if (!r.success)
            throw new Error('Erro ao pesquisar no Google: ' + r.msg)

        if (!r.data.results[0]) {
            msg.channel.send('*Nenhum resultado encontrado!*')
            return
        }

        msg.channel.send(r.data.results[0].link)
    }
}