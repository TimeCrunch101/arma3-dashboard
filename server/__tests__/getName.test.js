const {getName} = require('../utils/modController')
const {create} = require('../config/db')
beforeAll(async() => {
    await create()
})
test('Get Mod Name Function', async() => {
    const res = await getName('463939057')
    expect(res).toBe('ace')
})