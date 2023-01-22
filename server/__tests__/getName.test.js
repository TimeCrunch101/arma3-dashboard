const {getName} = require('../utils/modController')

test('Get Mod Name Function', async() => {
    const res = await getName('463939057')
    expect(res).toBe('ace')
})