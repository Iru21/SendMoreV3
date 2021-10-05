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

function getLocalIP(d = false) {
    const nets = networkInterfaces();
    const names = Object.keys(nets)
    let net = undefined
    let found = false
    for(let i = 0; i < names.length && !found; i++) {
        for(let j = 0; j < interfaces.length && !found; j++) {
            if(d) console.log(`${names[i]} -> ${interfaces[j]}`)
            if(names[i].includes(interfaces[j])) {
                const _in = nets[names[i]]?.filter(e => e.family == "IPv4" && !e.internal)[0]
                if(d) console.log(_in)
                net = _in?.address
                found = true
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
    builder.stdout.on("data", data => {if(data.toString().length != 0) console.log("[BUILDER] [LOG] " + data.toString())})
    process.once('SIGINT', () => {
        if(!builder.killed) {
            console.log("[BUILDER] [INFO] Aborting... [CODE SIGINT]")
            builder.kill('SIGINT') 
        }
        process.exit(0)
    })
    builder.on("close", (code) => {
        switch (code) {
            case 0:
                console.log(`[BUILDER] [INFO] Successfully finished building! [CODE ${code}]`)
                serve()
                break
            default:
                console.log(`[BUILDER] [INFO] Abroting... [CODE ${code}]`)
                break;
        }
    })
}

function serve() {
    const app = express()

    app.use(express.static(path.join(__dirname, '../build')))

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../build', 'index.html'))
    });

    app.listen(3000, () => console.log('Serving site! [PORT 3000]!'))
}

writeIpToFile()
