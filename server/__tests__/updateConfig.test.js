const {updateConfig} = require('../utils/updateConfig')
const {serverSettings} = require('../controllers/getController')
const path = require('path')
const {connect} = require('../config/db')
const req = {
    body: {
        STEAM_USERNAME: 'test',
        STEAM_PASS: 'test',
        STEAM_CMD_LOC: '/test/test',
        ARMA_SERVER_LOC: path.join(__dirname),
    }
}

test('Create Server Instance', async () => {
    const res = await serverSettings(req)
    expect(res).toEqual(true)
})

test('Update config function', async () => {
    const res = await updateConfig({
        hostname: 'hostname',
        adminPassword: 'adminPass',
        maxPlayers: 12,
        persistance: 0,
        VON: 0,
        PBOname: 'Alive.Altis',
        difficulty: 'Custom',
        battleye: 1,
        verifySigs: 2,
    }, {
        userPassword: {
            shouldDefine: '0',
            userPassword: 'UserPassword'
        }
    })
    expect(res).toEqual(true) 
})

test('Remove Server Setting', async() => {
    const db = await connect()
    db.run('DELETE FROM server_config WHERE server_id = 1',[],(err) => {
        expect(err).toEqual(null)
    })
})