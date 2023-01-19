if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const { downloadSteamMod } = require('./steamController')
const {updateConfig} = require('../utils/updateConfig')
const {startArmaServer, stopArmaServer} = require('../controllers/spawnController')
const modController = require('../utils/modController')
const armaConfig = require('../utils/armaConfig');
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
        await armaConfig.configToDatabase(configPreset,0,hostname,adminPassword,maxPlayers,persistance,VON,PBOname,difficulty,battleye,verifySigs,shouldDefinePassword,userPassword)
        await updateConfig({
            hostname: hostname,
            adminPassword: adminPassword,
            maxPlayers: maxPlayers,
            persistance: persistance,
            VON: VON,
            PBOname: PBOname,
            difficulty: difficulty,
            battleye: battleye,
            verifySigs: verifySigs,
        }, {
            userPassword: {
                shouldDefine: shouldDefinePassword,
                UserPass: userPassword
            }
        })
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
            console.log(`Downloading: ${name}`)
            await downloadSteamMod(process.env.STEAM_USERNAME, mod, name)
            await modController.modsToDatabase(mod, name)
        } catch (error) {
            console.error(`Got error: ${error}`) 
        }
    }
    console.log('Mods Downloaded..')
}

exports.getMods = (req, res) => {
    return new Promise( async (resolve, reject) => {
        try {
            pool.query('SELECT * FROM dbo_mods', (err, mods) => {
                if (err) throw err
                resolve(res.json({
                    status: 200,
                    mods: mods
                }))
            })
        } catch (error) {
            reject(error)
        }
    })
}

exports.selectMods = (req, res) => {
    req.body.mods.forEach(mod => {
        pool.query("UPDATE dbo_mods SET enabled = ?, server_only = ? WHERE modID = ?", [mod.enabled, mod.serverOnly, mod.modID], (err) => {
            if (err) throw err;
        })
    });
    res.json({
        status: 200,
        message: 'Mods updated'
    })
}

exports.uploadMission = (req, res) => {
    res.json({
        status: 200,
        message: 'File uploaded successfully'
    })    
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
    const {STEAM_USERNAME,STEAM_PASS,STEAM_CMD_LOC,ARMA_SERVER_LOC,} = req.body
    try {
        const db = await connect()
        db.run(`
            INSERT INTO server_config
            (server_id,STEAM_USERNAME,STEAM_PASS,STEAM_CMD_LOC,ARMA_SERVER_LOC)
            values(1,?,?,?,?)`,
            [STEAM_USERNAME,STEAM_PASS,STEAM_CMD_LOC,ARMA_SERVER_LOC],(err) => {
            try {
                if (err) throw err;
                res.status(201).json({
                    message: 'success'
                })
            } catch (error) {
                res.status(500).json({
                    message: error.message
                })
            }
        })
    } catch (DB_ERR) {
        res.status(500).json({
            message: DB_ERR.message
        })
    }
}