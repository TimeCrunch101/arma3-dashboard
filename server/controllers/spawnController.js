if (process.env.NODE_ENV !== 'production') require('dotenv')
const {exec, spawn} = require("child_process")
const { connect } = require('../config/db')
const {sendStream} = require('../socketServer')
const { getServerConfig } = require('../utils/other')

var armaPID

const startArmaServer = async () => {
    if (armaPID === undefined) {
        const serverConfig = await getServerConfig()
        return new Promise(async(resolve, reject) => {
            try {
                let modsList = ''
                const db = await connect()
                db.run("SELECT * FROM mods", (sqlError, data) => {
                    try {
                        if (sqlError) throw new Error('Error getting mods from DB', {cause: sqlError.message});
                        if (data) {
                            for (let i = 0; i < data.length; i++) {
                                const mod = data[i];
                                if (mod.enabled === 1) {
                                    modsList += `${serverConfig.STEAM_CMD_LOC}\\steamapps\\workshop\\content\\107410\\${mod.modID};`
                                }
                            }
                        }
                        const spawnArma3Server = spawn(`${serverConfig.ARMA_SERVER_LOC}\\arma3server.exe`, [
                            `-profiles=${serverConfig.ARMA_SERVER_LOC}\\`,
                            `-config=${serverConfig.ARMA_SERVER_LOC}\\config.cfg`,
                            `-mod=${modsList}`,
                            "-port=2302",
                            "-world=empty",
                        ])
                        spawnArma3Server.stdout.on('data', (output) => {
                            console.log(output.toString())
                        })
                        armaPID = spawnArma3Server.pid
                        resolve('Arma Started')
                    } catch (sqlError) {
                        reject(sqlError)
                    }
                    modsList = ""
                })
            } catch (DB_ERROR) {
                reject(DB_ERROR)
            } finally {
                modsList = ''
            }
        })
    } else {
        console.log("Thread already running")
    }
}

const stopArmaServer = () => {
    return new Promise((resolve, reject) => {
        exec('taskkill /im arma3server.exe', (error) => {
            try {
                if (error) throw new Error('ERROR: could not execute task kill command', {cause: error.message})
                resolve(true)
            } catch (error) {
                reject(error)
            } finally {
                armaPID = undefined
            }
        })
    })
}
const initWatchDog = () => {
    setInterval(() => {
        exec('tasklist', async (err, stdout, stderr) => {
            if (stdout.includes('arma3server.exe')) {
                sendStream('server-status', {
                    message: 'arma3server Running..'
                })
            } else {
                sendStream('server-status', {
                    message: 'Server Not Running'
                })
            }
        })
    }, 3000);
}

module.exports = {
    startArmaServer: startArmaServer,
    stopArmaServer: stopArmaServer,
    initWatchDog: initWatchDog,
}