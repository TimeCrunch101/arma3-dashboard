const { connect } = require('../config/db')

const getServerConfig = () => {
    return new Promise(async(resolve, reject) => {
      try {
        const db = await connect()
        db.all("SELECT * FROM server_config",[], (sqlError, data) => {
          try {
            if (sqlError) throw new Error("Error getting server config from DB", {cause: sqlError.message})
            // if (data[0] === undefined) throw new Error("No Arma3 server settings configured. Did you skip the first time setup?")
            resolve(data[0])
          } catch (sqlError) {
            reject(sqlError)
          }
        })
      } catch (DB_ERROR) {
        reject(DB_ERROR)
      }
    })
}

const getAllMissions = () => {
  return new Promise(async(resolve, reject) => {
    try {
      const db = await connect()
      db.all('SELECT * FROM missions',[],(err, data) => {
        try {
          if (err) throw err;
          resolve(data)
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
 * @param {Number} missionID ID for the mission file
 * */

const getMissionNameById = (missionID) => {
  return new Promise(async(resolve, reject) => {
    try {
      const db = await connect()
      db.all("SELECT missionName FROM missions WHERE missionID = ?",[missionID],(err, data) => {
        if (err) throw new Error('Could not get mission name', {cause: err.message})
        if (data[0] !== undefined) resolve(data[0].missionName.slice(undefined,-4))
        resolve('No Missions Saved')
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
    getServerConfig,
    getAllMissions,
    getMissionNameById
}