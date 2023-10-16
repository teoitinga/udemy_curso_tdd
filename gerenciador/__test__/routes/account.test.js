const request = require('supertest')

const app = require('../../src/app')

const MAIN_ROUTE = '/accounts'
let user;
beforeAll(async () => {

    mail = `${Date.now()}@mail.com`
    u = { name: 'Jonh Doe test', email: mail, password: '123456' }

    user = await app.services.user.save(u);
    user = await [...user][0]  
 
})

test('Deve inserir uma conta com sucesso', async () => {
    ac = `#AC${Date.now()}-AAC`

    const account = { name: ac, user_id: user.id, };

    const result = await request(app).post(MAIN_ROUTE).send(account);

    expect(result.status).toBe(201);
    expect(result.body.name).toEqual(account.name);
    expect(result.body.user_id).toEqual(user.id);
}) 