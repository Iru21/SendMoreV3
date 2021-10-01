const express = require('express')
const path = require('path')
const { spawn } = require('child_process')
const { networkInterfaces } = require('os')
const fs = require('fs')
const publicIp = require('public-ip')
const interfaces = ["Ethernet", "Wi-Fi", "eth", "wlan", "enp", "ens"]

async function writeIpToFile() {
    const lIp = getLocalIP()
    const pIp = await getPublicIp()
    if(!lIp) {
        logInterfaces()
        console.log("Current added interfaces:")
        console.log(interfaces)
        console.log("")
        console.log("Could not get local IP adress of the host machine! We have written your network interfaces containing IPv4 adresses and currently added ones, please make a pull request to add yours to the list :)")
        throw new Error()
    }
    console.log([lIp, pIp])
    const content = "REACT_APP_API_P=" + pIp + "\nREACT_APP_API_L=" + lIp
    await fs.writeFileSync(".env", content)
    build()
}

function logInterfaces() {
    const n = networkInterfaces();
    const r = {}

    for (const _ of Object.keys(n)) {
        for (const w of n[_]) {
            if (w.family === 'IPv4' && !w.internal) {
                if (!r[_]) {
                    r[_] = [];
                }
                r[_].push(w.address);
            }
        }
    }
    console.log("")
    console.log(r)
    console.log("")
}

function getLocalIP() {
    const nets = networkInterfaces();
    const names = Object.keys(nets)
    let net = undefined
    for(let i = 0; i < names.length; i++) {
        for(let j = 0; j < interfaces.length; j++) {
            if(names[i].includes(interfaces[j])) {
                net = nets[names[i]]?.filter(e => e.family == "IPv4")[0].address
            }
        }
    }
    return net
}

async function getPublicIp() {
    return await publicIp.v4()
}

function build() {
    const builder = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', "build"])
    console.log("[BUILDER] [RUNNING] " + builder.spawnargs.join(" "))
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
