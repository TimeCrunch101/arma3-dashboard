if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const axios = require('axios')
const {connect} = require('../config/db')

const getName = (modID) => {
    return new Promise((resolve, reject) => {
        axios.get(`https://steamcommunity.com/sharedfiles/filedetails/?id=${modID}`).then((res) => {
            const response = res.data
            const div = response.match(/(\"workshopItemTitle\").*</g)
            const divStrip = div[0].match(/\>.*</g)
            const nameArray = divStrip[0].match(/([a-zA-Z.0-9+-. \(\)\:\;\_])/g)
            var modName = ""
            for (let i = 0; i < nameArray.length; i++) {
                const letter = nameArray[i];
                modName+=letter
            }
            resolve(modName)
            modName = ""
        }).catch((err) => {
            reject(err)
        })
    })
}

const modsToDatabase = (modID, modName) => {
    return new Promise(async(resolve, reject) => {
        try {
            const db = await connect()
            db.all('SELECT modID from mods WHERE modID = ?',[modID], (err, data) => {
                try {
                    if (err) throw new Error("Could not retrieve mod", {cause: err.message})
                    console.log(data)
                    console.log(modID)
                    console.log(modName)
                    if (data?.length === 1) return reject('Mod Already Downloaded')
                    try {
                        db.run("INSERT INTO mods(modID, modName, enabled, server_only) VALUES(?,?,?,?)",[modID,modName,0,0],(err) => {
                            try {
                                if (err) throw new Error("Could not save mod info", {cause: err.message})
                                resolve('Mod Saved to database')
                            } catch (error) {
                                reject(error)
                            }
                        })
                    } catch (err) {
                        reject(err)
                    }
                } catch (sql_err) {
                    reject(sql_err)
                }
            })
        } catch (DB_ERR) {
            reject(DB_ERR)
        }
    })

}

module.exports = {
    getName: getName,
    modsToDatabase: modsToDatabase
}