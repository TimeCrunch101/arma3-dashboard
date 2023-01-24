const { spawn } = require('child_process')
const {sendStream} = require('../socketServer')
const {getServerConfig} = require('../utils/other')

const downloadSteamMod = async (modID, modName) => {
    const serverConfig = await getServerConfig()
    return new Promise((resolve, reject) => {
        let DownloadModFromSteam = spawn(serverConfig.STEAM_CMD_LOC+'\\steamcmd.exe', ['+login', serverConfig.STEAM_USERNAME, serverConfig.STEAM_PASS, '+workshop_download_item', '107410', modID, '+logout', '+quit'])
        DownloadModFromSteam.stdout.on('data', (output) => {
            if (output.toString().includes("Success. Downloaded item")) {
                sendStream('mod-downloaded', ({
                    status: 'Success',
                    modID: modID,
                    modName: modName,
                    message: `Successfully Downloaded: ${modName}`
                }))
                console.info(`Successfully Downloaded: ${modName}`)
            }
            if (output.toString().includes("ERROR! Download item")) reject(`Error downloading mod from SteamCMD: ${modID}`)
        })
        DownloadModFromSteam.on('close', (code) => {
            if (code === 0) {
                resolve()
            } else {
                if (code === 5) {
                    reject(`SteamCMD Error: exit code ${code}`)
                }
            }
        })
    })
}

module.exports = {
    downloadSteamMod: downloadSteamMod,
}