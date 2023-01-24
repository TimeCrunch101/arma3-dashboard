const {connect} = require('../config/db')

const configToDatabase = (configName,firstTimeConfig,hostname,adminPassword,maxPlayers,persistance,VON,PBOname,difficulty,battleye,verifySigs,shouldDefinePassword,userPassword) => {
    return new Promise(async(resolve, reject) => {
        try {
            const db = await connect()
            let sql = `
            INSERT INTO sconfig 
            (
                configName,
                active,
                hostname,
                adminPassword,
                maxPlayers,
                persistance,
                VON,
                PBOname,
                difficulty,
                battleye,
                verifySigs,
                userPass_ShouldDefine,
                userPass
            )
            VALUES
            (
                ?,?,?,?,?,?,?,?,?,?,?,?,?
            )
            `
            db.run(sql,[configName,firstTimeConfig,hostname,adminPassword,maxPlayers,persistance,VON,PBOname,difficulty,battleye,verifySigs,shouldDefinePassword,userPassword],(sqlError)=> {
                try {
                    if (sqlError) throw sqlError
                    resolve(true)
                } catch (sqlError) {
                    if (sqlError.message.includes('SQLITE_CONSTRAINT')) resolve(true)
                    reject(sqlError)
                }
            })
        } catch (DB_ERROR) {
           reject(DB_ERROR)
        }

    })
}

/**
 * @param {String} configID Only used in Test for now.
 **/

const deleteConfig = (configID) => {
    return new Promise(async(resolve, reject) => {
        const db = await connect()    
        db.run('DELETE FROM sconfig WHERE configID = ?',[configID],(err) => {
            if (err) reject(err)
            resolve(true)
        })
    })
}

/**
 * @param {Number} configID Config ID in sconfig table
 **/

const getConfig = (configID) => {
    return new Promise(async(resolve, reject) => {
        try {
            const db = await connect()
            db.all("SELECT * FROM sconfig WHERE configID = ?",[configID],(err, data) => {
                try {
                    if (err) reject(err)
                    resolve(data[0])
                } catch (err) {
                    reject(err)
                }
            })
        } catch (err) {
            reject(err)
        }
    })
}
/**
 * @param {Number} configID Config ID in sconfig table
 **/

const setActive = (configID) => {
    return new Promise(async(resolve, reject) => {
        try {
            const db = await connect()
            db.run("UPDATE sconfig SET active = ? WHERE configID = ?",[1, configID],(err) => {
                try {
                    if (err) reject(err)
                    db.run("UPDATE sconfig SET active = 0 WHERE configID != ?",[configID],(err) => {
                        if (err) throw err;
                        resolve(true)
                    })
                } catch (err) {
                    reject(err)
                }
            })
        } catch (err) {
            reject(err)
        }
    })
}

/**
 * @param {String} STEAM_USERNAME Your Steam Username, will be used to log into steamCMD
 * @param {String} STEAM_PASS Your Steam Password, will be used to log into steamCMD
 * @param {String} STEAM_CMD_LOC Steam CMD Install Location
 * @param {String} ARMA_SERVER_LOC Arma Serve Install Location
 **/

const serverConfig = (STEAM_USERNAME,STEAM_PASS,STEAM_CMD_LOC,ARMA_SERVER_LOC) => {
    return new Promise(async(resolve, reject) => {
        try {
            const db = await connect()
            db.run(`
            INSERT INTO server_config
            (server_id,STEAM_USERNAME,STEAM_PASS,STEAM_CMD_LOC,ARMA_SERVER_LOC)
            values(1,?,?,?,?)`,[STEAM_USERNAME,STEAM_PASS,STEAM_CMD_LOC,ARMA_SERVER_LOC],(err) => {
                try {
                    if (err) throw err;
                    resolve(true)
                } catch (err) {
                    reject(err)
                }
            })
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    configToDatabase: configToDatabase,
    deleteConfig: deleteConfig,
    getConfig: getConfig,
    serverConfig: serverConfig,
    setActive: setActive,
}