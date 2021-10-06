import { Client, TextChannel } from 'discord.js'
import d from './dir'
export default async function sender(client: Client, urls: string[]) {
    const channel = client.guilds.cache.get(process.env.GUILD!)!.channels.cache.get(process.env.CHANNEL!) as TextChannel
    if(!channel) throw new Error(`Channel with ID(${process.env.CHANNEL}) in guild with ID(${process.env.GUILD}) was not found!`)
    const images: [ string[],  string[], string[], string[], string[]] = [[], [], [], [], []]
    let w = 0
    for(let i = 0; i < urls.length; i++) {
        if(images[w].length == 5) w++
        images[w].push(urls[i])
    }
    for(let i = 0; i < images.length; i++) {
        if(images[i].length != 0) {
            setTimeout(()=>{
                channel.send(`${images[i].join(`\n`)}`)
            }, 500)
        }
    }
    console.log(`Successfully sent ${urls.length} files!`)
}