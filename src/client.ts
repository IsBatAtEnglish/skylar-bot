import * as Discord from "discord.js"
import Settings from "./settings"

class Client {
    public discord: Discord.Client;
    private settings: Settings;
    private token: string;
    constructor (settings_file: string) {
        this.settings = new Settings(settings_file);
        this.discord = new Discord.Client();
        this.token = this.settings.value('auth');
    }

    /**
     * start
     * @description Inicia o cliente
     */
    public start(): Promise<string> {
        return this.discord.login(this.token)
    }
}

export { Client }