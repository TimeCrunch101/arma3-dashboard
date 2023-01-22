const {getServerConfig, getAllMissions, getMissionNameById} = require('../utils/other')
const {create} = require('../config/db')
beforeAll(async() => {
    await create()
})

// test('Init DB', async () => {
//     const res = 
//     expect(res).toEqual('DB INIT COMPLETE')
// })


test('Test FirstTime Config', async () => {
    const res = await getServerConfig()
    expect(res).toEqual(undefined)
})

test('GetAllMissions test', async() => {
    const res = await getAllMissions()
    expect(res).toEqual([])
})

test('getMissionNameById test', async() => {
    const res = await getMissionNameById(1)
    expect(res).toEqual('No Missions Saved')
})