const jwt = require('jwt-simple');

const request = require('supertest')

const app = require('../../src/app')

let u;

// TODO Resolver esta duplicação de variável. Colocar em aqrquivo.env. Atualmente está em? config/passport.js
const SECRET = 'sdasjhdjew43987ddhskdjs';
const MAIN_ROUTE = '/v1/users'

beforeAll(async () => {

    mail = `${Date.now()}@mail.com`
    u = { name: 'Jonh Doe test', email: mail, password: '123456' }

    u = await app.services.user.save(u);
    u = await [...u][0];

    u.token = jwt.encode(u, SECRET);
})

test('Deve listar todos os usuario', async () => {

    const result = await request(app)
        .get(MAIN_ROUTE)
        .set('authorization', `bearer ${u.token}`);

    expect(result.status).toBe(200);
    expect(result.body.length).toBeGreaterThanOrEqual(0);
    expect(result.body[0]).not.toHaveProperty('password');
})

test('Deve inserir usuário com sucesso', async () => {

    const mail = `${Date.now()}@mail.com`
    const user = { name: 'Jonh Doe', email: mail, password: '123456' }

    const result = await request(app)
        .post(MAIN_ROUTE).send(user)
        .set('authorization', `bearer ${u.token}`);

    expect(result.status).toBe(201);
    expect(result.body.name).toBe(user.name);
    expect(result.body).not.toHaveProperty('password');
})
test('Não deve inserir usuário sem nome', async () => {

    const mail = `${Date.now()}@mail.com`
    const user = { email: mail, password: '123456' }

    const result = await request(app)
        .post(MAIN_ROUTE).send(user)
        .set('authorization', `bearer ${u.token}`);

    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Nome do usuário é obrigatório');
})
test('Não deve inserir usuário sem email', async () => {

    const mail = `${Date.now()}@mail.com`
    const user = { name: 'Jonh Doe', password: '123456' }

    const result = await request(app)
        .post(MAIN_ROUTE).send(user)
        .set('authorization', `bearer ${u.token}`);

    expect(result.status).toBe(400);
    expect(result.body.error).toBe('E-mail do usuário é obrigatório');
})

test('Deve armazenar uma senha criptografada', async () => {
    const mail = `${Date.now()}@mail.com`
    const user = { name: 'Jonh Doe', email: mail, password: '123456' }
    const result = await request(app)
        .post(MAIN_ROUTE).send(user)
        .set('authorization', `bearer ${u.token}`);

    expect(result.status).toBe(201);

    const { id } = result.body;
    const userdb = await app.services.user.findOne({ id });

    expect(userdb.password).not.toBeUndefined();
    expect(userdb.password).not.toBe(user.password);

})


test('Não deve inserir usuário sem senha', async () => {

    const mail = `${Date.now()}@mail.com`
    const user = { name: 'Jonh Doe', email: mail }

    const result = await request(app)
        .post(MAIN_ROUTE).send(user)
        .set('authorization', `bearer ${u.token}`);

    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Senha é obrigatória para o usuário.');
})
test('Não deve inserir usuário com e-mail já existente', async () => {

    const mail = `123456@mail.com`
    const user1 = { name: 'Jonh Doe One', email: mail, password: '123456' }
    const user = { name: 'Jonh Doe Twos', email: mail, password: '123456' }

    let result = await request(app)
        .post(MAIN_ROUTE).send(user1)
        .set('authorization', `bearer ${u.token}`);

    result = await request(app).post(MAIN_ROUTE).send(user)
        .set('authorization', `bearer ${u.token}`);

    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Já existe usuário com este e-mail.');
}) 