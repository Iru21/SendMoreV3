import fs from 'fs'
const content = JSON.parse(fs.readFileSync('../../../../../site_config.json').toString())
const shared = JSON.parse(fs.readFileSync('../../../../../config/site.json').toString())
interface Cfg {
    MAX_FILE_COUNT: number,
    API_PORT: number,
}
const conf: Cfg = { ...content, ...shared }
console.log(conf)

export default conf