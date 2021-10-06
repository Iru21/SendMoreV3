import { Client } from 'discord.js'
import sender from './sender'
import fs from 'fs'
import d from './dir'
import fsExtra from 'fs-extra'
// tslint:disable-next-line: no-var-requires
const { Catbox } = require('catbox.moe')
const cb = new Catbox(process.env.CATBOX_USER_HASH)
export default async function uploader(client: Client) {
    const files: string[] = []
    const images = await fs.readdirSync(d('../temp/'))
    for(let i = 0; i < images.length; i++) {
        const url = await cb.upload(d(`../temp/${images[i]}`))
        files.push(url)
    }
    fsExtra.emptyDirSync(d('../temp/'))
    sender(client, files)
}