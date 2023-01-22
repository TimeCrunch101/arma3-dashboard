if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const { downloadSteamMod } = require('./steamController')
const {updateConfig} = require('../utils/updateConfig')
const {startArmaServer, stopArmaServer} = require('../controllers/spawnController')
const modController = require('../utils/modController')
const armaConfig = require('../utils/armaConfig');
const {getAllMissions, getMissionNameById} = require('../utils/other')
const { connect } = require('../config/db');

exports.startServer = async (req, res) => {
    try {
        await startArmaServer()
        res.json({
            status: 200,
            message: "Message"
        })
    } catch (error) {
        res.status(500).json({
            message: 'Could not start the server at this time',
            errorMsg: error.message,
            cause: error.cause,
            stack: error.stack
        })
    }
}

exports.stopServer = async (req, res) => {
    try {
        await stopArmaServer()
        res.status(200).json({
            message: 'Successfully stopped the Arma3 Service'
        })
    } catch (error) {
        res.status(400).json({
            message: 'Could not stop the Arma3 Instance at this time.',
            errorMsg: error.message,
            cause: error.cause,
            stack: error.stack 
        })
    }
}

exports.setActiveConfig = async(req, res) => {
    try {
        const {configID} = req.body
        const config = await armaConfig.getConfig(configID)
        await armaConfig.setActive(configID)
        await updateConfig({
            hostname: config.hostname,
            adminPassword: config.adminPassword,
            maxPlayers: config.maxPlayers,
            persistance: config.persistance,
            VON: config.VON,
            PBOname: config.PBOname,
            difficulty: config.difficulty,
            battleye: config.battleye,
            verifySigs: config.verifySigs,
        }, {
            userPassword: {
                shouldDefine: config.shouldDefinePassword,
                UserPass: config.userPassword
            }
        })
        res.status(201)
    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

exports.updateServerConfig = async (req, res) => {
    try {
        const {
            configPreset,
            hostname,
            adminPassword,
            maxPlayers,
            persistance,
            VON,
            PBOname,
            difficulty,
            battleye,
            verifySigs,
            shouldDefinePassword,
            userPassword
        } = req.body
        const FileName = await getMissionNameById(PBOname)
        await armaConfig.configToDatabase(configPreset,0,hostname,adminPassword,maxPlayers,persistance,VON,FileName,difficulty,battleye,verifySigs,shouldDefinePassword,userPassword)
        res.json(201)
    } catch (error) {
        res.status(500).json({
            message: error.message,
            cause: error.cause
        })
    }
}

exports.downloadMod = async (req, res) => {
    res.sendStatus(200)
    const userMods = req.body.userMods
    for (let i = 0; i < userMods.length; i++) {
        const mod = userMods[i].value;
        try {
            const name = await modController.getName(mod)
            console.info(`Downloading: ${name}`)
            await downloadSteamMod(process.env.STEAM_USERNAME, mod, name)
            await modController.modsToDatabase(mod, name)
        } catch (error) {
            console.error(`Got error: ${error}`) 
        }
    }
    console.info('Mods Downloaded..')
}

exports.getMods = async (req, res) => {
    try {
        const db = await connect()
        db.all('SELECT * FROM mods',[],(err, mods) => {
            try {
                if (err) throw new Error('Could not retrieve mods', {cause: err.message})
                res.status(200).json({
                    mods: mods
                })
            } catch (err) {
                res.status(500).json({
                    error: err.message,
                    cause: err.cause
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
            cause: err.cause
        })
    }
}

exports.selectMods = async (req, res) => {
    try {
        const db = await connect()
        req.body.mods.forEach(mod => {
            db.run("UPDATE mods SET enabled = ?, server_only = ? WHERE modID = ?", [mod.enabled, mod.serverOnly, mod.modID], (err) => {
                try {
                    if (err) throw new Error('Could not update mods table', {cause: err.message})
                } catch (err) {
                    res.status(400).json({
                        error: err.message,
                        cause: err.cause
                    })
                }
            })
        });
        res.status(201).json({
            message: 'Updated mod dependencies'
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
            cause: err.cause
        })
    }
}

exports.uploadMission = async (req, res) => {
    if (req.file?.originalname !== undefined) {
        try {
            const db = await connect()
            db.run("INSERT INTO missions(missionName, dest) VALUES(?,?)",[req.file.filename,req.file.destination],(err) => {
                try {
                    if (err) throw err;
                    res.status(200).json({
                        message: 'Successfully uploaded mission'
                    })
                } catch (err) {
                    res.status(400).json({
                        error: err.message,
                    })
                }
            })
        } catch (err) {
            res.status(500).json({
                error: err.message,
            })
        }
    } else {
        res.status(400).json({
            message: 'Nothing was uploaded'
        })
    }
}

exports.queryFirstTimeSetup = async (req, res) => {
    try {
        const db = await connect()
        db.all('SELECT * FROM server_config',[],(sqlError, data) => {
            try {
                if (sqlError) throw new Error("Error occurred executing SQL statement", {cause: sqlError.message})
                if (data.length === 0) {
                    res.status(200).json({
                        serverStatus: false,
                        error: null,
                        cause: null
                    })
                } else {
                    res.status(200).json({
                        serverStatus: true,
                        error: null,
                        cause: null
                    })
                }
            } catch (sqlError) {
                res.status(500).json({
                    serverStatus: null,
                    error: sqlError.message,
                    cause: sqlError.cause
                })
            }
        })
    } catch (DB_ERROR) {
        res.status(500).json({
            serverStatus: null,
            error: DB_ERROR.message,
            cause: DB_ERROR.cause
        })
    }
}

exports.serverSettings = async (req, res) => {
    try {
        const {STEAM_USERNAME,STEAM_PASS,STEAM_CMD_LOC,ARMA_SERVER_LOC} = req.body
        await armaConfig.serverConfig(STEAM_USERNAME,STEAM_PASS,STEAM_CMD_LOC,ARMA_SERVER_LOC)
        res.status(201).json({
            message: 'Settings Saved'
        })
    } catch (err) {
        res.status(400).json({
            err
        })
    }
}

exports.getAllConfigPresets = async (req, res) => {
    try {
        const db = await connect()
        db.all("SELECT * FROM sconfig",[],(err, data) => {
            try {
                if (err) throw new Error('Could not get config presets', {cause: err.message})
                res.status(200).json({
                    presets: data
                })
            } catch (err) {
                res.status(500).json({
                    err
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            err
        })
    }
}

exports.getMissions = async (req, res) => {
    try {
        const missions = await getAllMissions()    
        res.status(200).json({
            missions
        })
    } catch (err) {
        res.status(500).json({
            err
        })
    }

}