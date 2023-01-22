const armaConfig = require('../utils/armaConfig')
const configName = 'Config Name123'

test('Insert new config to DB',async() => {
    const res = await armaConfig.configToDatabase(configName, 0, 'Server Hostname', 'adminPassword', 40, 1, 1, 'Mission.Altis', 'Custom', 0, 2, 1, 'serverPassword')
    expect(res).toEqual(true)
})

test('Delete config from DB',async() => {
    const confID = await armaConfig.getConfig(configName)
    const delRes = await armaConfig.deleteConfig(confID)
    expect(delRes).toEqual(true)
})