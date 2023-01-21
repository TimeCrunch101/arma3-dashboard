const express = require('express')
const getRouter = express.Router()
const getController = require('../controllers/getController')
const {connect} = require('../config/db')

const getMPMissionsFolder = () => {
  return new Promise(async(resolve, reject) => {
    try {
      const db = await connect()
      db.all("SELECT * FROM server_config",[],(err, data) => {
        if (err) throw err;
        resolve(data[0].ARMA_SERVER_LOC+"\\mpmissions")
      })
    } catch (DB_ERR) {
      reject(DB_ERR)
    }
  })
}

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
      cb(null, await getMPMissionsFolder())
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
const upload = multer({
    storage: storage,    
})

const initGetRouter = (app) => {

    getRouter.get('/get/mods', getController.getMods)
    getRouter.get('/start', getController.startServer)
    getRouter.post('/download/mods', getController.downloadMod)
    getRouter.post('/select/mods', getController.selectMods)
    getRouter.get('/query/first-time-setup', getController.queryFirstTimeSetup)
    getRouter.get("/stopserver", getController.stopServer)
    getRouter.post("/update/config", getController.updateServerConfig)
    getRouter.post("/upload/mission", upload.single('file'), getController.uploadMission)
    getRouter.post("/server/settings", getController.serverSettings)

    return app.use("/", getRouter)
}


module.exports = getRouter
module.exports = initGetRouter