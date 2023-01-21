if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const {connect} = require('../config/db')

const configToDatabase = (configName,firstTimeConfig,hostname,adminPassword,maxPlayers,persistance,VON,PBOname,difficulty,battleye,verifySigs,shouldDefinePassword,userPassword) => {
    return new Promise(async(resolve, reject) => {
        try {
            const db = await connect()
            let sql = `
            INSERT INTO sconfig 
            (
                configID,
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
                ?,?,?,?,?,?,?,?,?,?,?,?,?,?
            )
            `
            // let sql = `
            // UPDATE sconfig 
            // SET configName = ?,
            //     firstTimeConfig = ?,
            //     hostname = ?,
            //     adminPassword = ?,
            //     maxPlayers = ?,
            //     persistance = ?,
            //     VON = ?,
            //     PBOname = ?,
            //     difficulty = ?,
            //     battleye = ?,
            //     verifySigs = ?,
            //     userPass_ShouldDefine = ?,
            //     userPass = ?
            // WHERE
            //     configID = 1
            // `
            db.run(sql,[1,configName,firstTimeConfig,hostname,adminPassword,maxPlayers,persistance,VON,PBOname,difficulty,battleye,verifySigs,shouldDefinePassword,userPassword],(sqlError)=> {
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
module.exports = {
    configToDatabase: configToDatabase,
}