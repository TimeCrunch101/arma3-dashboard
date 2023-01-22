const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')

const connect = () => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("db.sqlite3",sqlite3.OPEN_READWRITE,(error) => {
    
      try {
        if (error) throw new Error("Error connecting to the database", {cause: error.message})
        resolve(db)
      } catch (err) {
        reject(err)
      }
    })
  })
}

const create = () => {
  return new Promise(async(resolve, reject) => {
    try {
      if (!fs.existsSync(__dirname + "/../../db.sqlite3")) {
        fs.appendFileSync(__dirname + "/../../db.sqlite3",'',(err) => {
          try {
            if (err) throw new Error('Could not create a new Database', {cause: err.message})
          } catch (error) {
            // console.error(`ERROR: ${error.message} Cause: ${error.cause}`)
            reject(error)
          }
        })
      }
      const db = await connect()
      db.run(`
      CREATE TABLE IF NOT EXISTS "mods" (
        "modID"	INTEGER NOT NULL UNIQUE,
        "modName"	TEXT,
        "enabled"	INTEGER DEFAULT null,
        "server_only"	INTEGER DEFAULT null,
        PRIMARY KEY("modID")
      );
      `,[],(err) => {
        try {
          if (err) throw err;
          db.run(`
          CREATE TABLE IF NOT EXISTS "sconfig" (
            "configID"	INTEGER NOT NULL UNIQUE,
            "configName"	TEXT DEFAULT null,
            "firstTimeConfig"	INTEGER DEFAULT null,
            "hostname"	TEXT DEFAULT null,
            "adminPassword"	TEXT DEFAULT null,
            "maxPlayers"	INTEGER DEFAULT null,
            "persistance"	INTEGER DEFAULT null,
            "VON"	INTEGER DEFAULT null,
            "PBOname"	TEXT DEFAULT null,
            "difficulty"	INTEGER DEFAULT null,
            "battleye"	INTEGER DEFAULT null,
            "verifySigs"	INTEGER DEFAULT null,
            "userPass_ShouldDefine"	INTEGER DEFAULT null,
            "userPass"	TEXT DEFAULT null,
            PRIMARY KEY("configID" AUTOINCREMENT)
          );        
          `,[],(err) => {
            try {
              if (err) throw err;
              db.run(`
              CREATE TABLE IF NOT EXISTS "server_config" (
                "server_id"	INTEGER NOT NULL UNIQUE,
                "STEAM_USERNAME"	TEXT DEFAULT null,
                "STEAM_PASS"	TEXT DEFAULT null,
                "STEAM_CMD_LOC"	TEXT DEFAULT null,
                "ARMA_SERVER_LOC"	TEXT DEFAULT null,
                PRIMARY KEY("server_id" AUTOINCREMENT)
              );       
              `,[],(err) => {
                try {
                  if (err) throw err;
                  db.run(`
                  CREATE TABLE IF NOT EXISTS "missions" (
                    "missionID"	INTEGER NOT NULL UNIQUE,
                    "missionName"	TEXT NOT NULL UNIQUE,
                    "dest"	TEXT,
                    PRIMARY KEY("missionID" AUTOINCREMENT)
                  );`,[],(err) => {
                    try {
                      if (err) throw err;
                      resolve('DB INIT COMPLETE')
                    } catch (err) {
                      // console.error(error)
                      reject(err)
                    }
                  })
                } catch (error) {
                  // console.error(error)
                  reject(error)
                }
              })
            } catch (error) {
              reject(error)
            }
          })
        } catch (error) {
          reject(error)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  connect,
  create
}