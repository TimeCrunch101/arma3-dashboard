if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const axios = require('axios')
const {pool} = require('../config/db')

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
        pool.query('SELECT modID FROM dbo_mods WHERE modID = ?', [modID], (err, data) => {
            if (err) throw err;
            // console.log(data.length)
            if (data.length === 1) return reject('Mod Already Downloaded')
            try {
                pool.query("INSERT INTO dbo_mods SET ?", {
                    modID: modID,
                    modName: modName
                }, (err) => {
                    if (err) throw err;
                    resolve('Mod Saved to database')
                })
            } catch (error) {
                reject('Internal Server Err')
            }
        })
    })

}



module.exports = {
    getName: getName,
    modsToDatabase: modsToDatabase
}