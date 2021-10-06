import { Router, Request, Response, NextFunction } from 'express'
import { sha256 } from 'js-sha256'
import { randomBytes } from 'crypto'
import client from './bot'
import fs from 'fs'
import sender from './sender'
import uploader from './uploader'
import d from './dir'
const router = Router()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200)
})

router.post('/validate', async (req: Request, res: Response, next: NextFunction) => {
    if(!verify(req.headers.authorization)) return res.status(200).send(false)
    else return res.status(200).send(true)
})

router.post('/send', async (req: Request, res: Response, next: NextFunction) => {
    if(!verify(req.headers.authorization)) return res.status(401).send("Invalid API key!")
    if(!req.body?.hashes) return res.status(400).send("Missing hash string!")
    if(!req.body?.exts) return res.status(400).send("Missing extentions!")
    const hashes = req.body.hashes
    const exts = req.body.exts
    for(let i = 0; i < hashes.length; i++) {
        fs.writeFile(d(`../temp/${randomBytes(5).toString('hex')}.${exts[i]}`), hashes[i], "base64", () => {/*ignore*/})
    }
    setTimeout(() => {
        uploader(client)
    }, exts.length * 1000)
    return res.status(200).send("Success!")
})

function verify(s = "empty") {
    s = s.replace("key ", "")
    return (s == sha256(process.env.API_KEY!))
}

export { router }