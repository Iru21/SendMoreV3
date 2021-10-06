import { Client, Intents } from 'discord.js'
export default class Bot extends Client {
    constructor() {
        super({ intents: [Intents.FLAGS.GUILDS] })
    }
    start() {
        this.on('ready', () => {
            console.log(`Logged in as ${this.user!.tag}!`);
        });
        this.login(process.env.BOT_TOKEN)
    }
}