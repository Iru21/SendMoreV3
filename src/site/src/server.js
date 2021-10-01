const express = require('express')
const path = require('path')
const { spawn } = require('child_process')
const { networkInterfaces } = require('os')
const fs = require('fs')
const publicIp = require('public-ip')

async function writeIpToFile() {
    const lIp = getLocalIP()
    const pIp = await getPublicIp()
    console.log([lIp, pIp])
    const content = "REACT_APP_API_P=" + pIp + "\nREACT_APP_API_L=" + lIp
    await fs.writeFileSync(".env", content)
    build()
}

function getLocalIP() {
    const nets = networkInterfaces();
    return nets.Ethernet?.filter(e => e.family == "IPv4")[0].address || nets["Wi-Fi"]?.filter(e => e.family == "IPv4")[0].address
}

async function getPublicIp() {
    return await publicIp.v4()
}

function build() {
    const builder = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', "build"])
    console.log(builder.spawnargs.join(" "))
    builder.stderr.on("data", data => {if(data.toString().length != 0) console.log("[BUILDER] [ERR] " + data.toString())})
    builder.stdout.on("data", data => {if(data.toString().length != 0) console.log("[BUILDER] [INFO] " + data.toString())})
    builder.on("close", (code) => {
        console.log(`FINISHED BUILDING -- CODE ${code}`);
        serve()
    })
}

function serve() {
    const app = express()

    app.use(express.static(path.join(__dirname, '../build')))

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../build', 'index.html'))
    });

    app.listen(3000, () => console.log('Site on 3000!'))
}

writeIpToFile()
