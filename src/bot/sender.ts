import { MessageAttachment, Client, TextChannel } from 'discord.js'
import fs from 'fs'
import fsExtra from 'fs-extra'
import d from './dir'
import config from './config'
export default async function sender(client: Client) {
    const channel = client.guilds.cache.get(config.SEND_LOCATION.GUILD)!.channels.cache.get(config.SEND_LOCATION.CHANNEL) as TextChannel
    if(!channel) return
    const images: [MessageAttachment[], MessageAttachment[], MessageAttachment[]] = [[], [], []]
    const files = await fs.readdirSync(d('../temp/'))
    let w = 0
    for(let i = 0; i < files.length; i++) {
        if(images[w].length == 10) w++
        const atta = new MessageAttachment(d('../temp/') + files[i])
        atta.name = files[i]
        images[w].push(atta)
    }
    for(let i = 0; i < images.length; i++) {
        if(images[i].length != 0) setTimeout(()=>{
            channel.send(
                {
                    files: [
                        ...images[i]
                    ]
                }
            )
        }, 2000)
    }
    setTimeout(() => {
        fsExtra.emptyDirSync(d('../temp/'))
    }, images.length * 3000)
}