if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const {connect} = require('../config/db')

const configToDatabase = (configName,firstTimeConfig,hostname,adminPassword,maxPlayers,persistance,VON,PBOname,difficulty,battleye,verifySigs,shouldDefinePassword,userPassword) => {
    return new Promise(async(resolve, reject) => {
        try {
            const db = await connect()
            let sql = `
            INSERT INTO sconfig 
            (
                configName,
                firstTimeConfig,
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

const deleteConfig = (configID) => {
    return new Promise(async(resolve, reject) => {
        const db = await connect()    
        db.run('DELETE FROM sconfig WHERE configID = ?',[configID],(err) => {
            if (err) reject(err)
            resolve(true)
        })
    })
}

const getConfig = (configName) => {
    return new Promise(async(resolve, reject) => {
        const db = await connect()
        db.all("SELECT configID FROM sconfig WHERE configName = ?",[configName],(err, data) => {
            if (err) reject(err)
            resolve(data[0].configID)
        })
    })
}

module.exports = {
    configToDatabase: configToDatabase,
    deleteConfig: deleteConfig,
    getConfig: getConfig,
}