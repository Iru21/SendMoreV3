import { Client, Intents } from 'discord.js'
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.on('ready', () => {
    console.log(`Logged in as ${client.user!.tag}!`);
});

client.login(process.env.BOT_TOKEN)

export default client