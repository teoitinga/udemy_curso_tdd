const jwt = require('jwt-simple');
const request = require('supertest')

const app = require('../../src/app')

const MAIN_ROUTE = '/v1/accounts'

// TODO Resolver esta duplicação de variável. Colocar em aqrquivo.env. Atualmente está em? config/passport.js
const SECRET = 'sdasjhdjew43987ddhskdjs';


let u;

beforeAll(async () => {

    mail = `${Date.now()}@mail.com`
    u = { name: 'Jonh Doe test', email: mail, password: '123456' }

    u = await app.services.user.save(u);
    u = await [...u][0]
    u.token = jwt.encode(u, SECRET);
})

test('Deve inserir uma conta com sucesso', async () => {
    ac = `#AC${Date.now()}-AAC`

    const account = { name: ac, user_id: u.id, };

    const result = await request(app)
    .post(MAIN_ROUTE).send(account)
    .set('authorization', `bearer ${u.token}`);
    
    
    expect(result.status).toBe(201);
    expect(result.body.name).toEqual(account.name);
    expect(result.body.user_id).toEqual(u.id);
})

test('Não Deve inserir uma conta sem nome', async () => {
    ac = `#AC${Date.now()}-AAC`
    
    const account = { user_id: u.id, };
    
    const result = await request(app)
    .post(MAIN_ROUTE).send(account)
    .set('authorization', `bearer ${u.token}`);
    

    expect(result.status).toBe(400);
    expect(result.body.error).toEqual(`Nome da conta é obrigatório`);
})

test.skip('Não deve inserir uma conta de nome duplicado para o mesmo usuário', ()=>{
    
})
test.skip('Deve listar apenas as contas do usuário', ()=>{

})
test.skip('mesmo usuário', ()=>{

})
test('Deve listar todas as contas', async () => {
    const account = {
        name: `#AC${Date.now()}-AAC`,
        user_id: u.id
    }

    await app.db('accounts').insert(account)
    const res = await request(app)
    .get(MAIN_ROUTE)
    .set('authorization', `bearer ${u.token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
})

test('Deve retornar uma conta por ID', async () => {
    const account = {
        name: `AC${Date.now()}-AAC`,
        user_id: u.id
    }

    // Insere o registro
    await app.db('accounts').insert(account);
    // Recupera o registro do banco de dados para obter o id ddeste registro
    const acs = await app.db('accounts').where(account).first();

    // Faz a busca para testar a rota
    const res = await request(app)
    .get(`${MAIN_ROUTE}/${acs.id}`)
    .set('authorization', `bearer ${u.token}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toEqual(account.name);
    expect(res.body.user_id).toEqual(account.user_id);


})

test.skip('Naão deve listar as contas de outro usuário', ()=>{

})

test('Deve alterar uma conta', async () => {
    const account = {
        name: `AC${Date.now()}-AAC`,
        user_id: u.id
    }

    newdata = {
        name: `NN ${Date.now()}-AAC`
    }

    // Insere o registro
    await app.db('accounts').insert(account);
    // Recupera o registro do banco de dados para obter o id ddeste registro
    const acs = await app.db('accounts').where(account).first();

    // Faz a busca para testar a rota
    const res = await request(app)
    .put(`${MAIN_ROUTE}/${acs.id}`).send(newdata)
    .set('authorization', `bearer ${u.token}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toEqual(newdata.name);
})

test.skip('Naão deve alterar as contas de outro usuário', ()=>{

})

test('Deve remover uma conta', async () => {
    const account = {
        name: `AC${Date.now()}-AAC`,
        user_id: u.id
    }
    // Insere o registro
    await app.db('accounts').insert(account);
    // Recupera o registro do banco de dados para obter o id ddeste registro
    const acs = await app.db('accounts').where(account).first();

    // Faz a busca para testar a rota
    const res = await request(app)
    .delete(`${MAIN_ROUTE}/${acs.id}`)
    .set('authorization', `bearer ${u.token}`);

    expect(res.status).toBe(204);
})

test.skip('Naão deve remover as contas de outro usuário', ()=>{

})