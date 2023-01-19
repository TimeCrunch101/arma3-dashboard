const { connect } = require('../config/db')

const getServerConfig = () => {
    return new Promise(async(resolve, reject) => {
      try {
        const db = await connect()
        db.all("SELECT * FROM server_config",[], (sqlError, data) => {
          try {
            if (sqlError) throw new Error("Error getting server config from DB", {cause: sqlError.message})
            if (data[0] === undefined) throw new Error("No Arma3 server settings configured. Did you skip the first time setup?")
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

module.exports = {
    getServerConfig
}