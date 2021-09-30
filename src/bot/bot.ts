import { Client, Intents } from 'discord.js'
import config from './config'
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.on('ready', () => {
    console.log(`Logged in as ${client.user!.tag}!`);
});

client.login(config.BOT_TOKEN)

export default client