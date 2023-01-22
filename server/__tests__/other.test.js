const {getServerConfig, getAllMissions, getMissionNameById} = require('../utils/other')

test('Test FirstTime Config', async () => {
    try {
        const res = await getServerConfig()
    } catch (error) {
        expect(error.message).toEqual("No Arma3 server settings configured. Did you skip the first time setup?")
    }
})

test('GetAllMissions test', async() => {
    const res = await getAllMissions()
    expect(res).toEqual([])
})

test('getMissionNameById test', async() => {
    const res = await getMissionNameById(1)
    expect(res).toEqual('No Missions Saved')
})