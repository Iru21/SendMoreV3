import fs from 'fs'
const content = JSON.parse(fs.readFileSync('../../../config/bot.json').toString())
const shared = JSON.parse(fs.readFileSync('../../../config/shared.json').toString())
interface Cfg {
    BOT_TOKEN: string
    API_PORT: number
    BATCH_FILE_SIZE_LIMIT: string
    SEND_LOCATION: {
        GUILD: string,
        CHANNEL: string
    }
}
const conf: Cfg = { ...content, ...shared }
console.log(conf)

export default conf