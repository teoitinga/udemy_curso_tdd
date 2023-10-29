const moment = require('moment');
const request = require('supertest')

const app = require('../../src/app')
const bcrypt = require('bcrypt-nodejs');

const jwt = require('jwt-simple');

// TODO Resolver esta duplicação de variável. Colocar em aqrquivo.env. Atualmente está em? config/passport.js
const SECRET = 'sdasjhdjew43987ddhskdjs';

const MAIN_ROUTE = '/v1/transactions'

let user1;
let user2;
let acc1;
let acc2;

beforeAll(async () => {

    // Limpando o banco de dados. Obs:  deve estar na ordem para evitar erros devido a dependências de registros em outras tabelas
    await app.db('transactions').del();
    await app.db('accounts').del();
    await app.db('users').del();

    // inserindo usuários
    const salt = bcrypt.genSaltSync(10);

    user1 = { name: 'Jonh Doe user 1', email: `${Date.now()}@hotmail.com`, password: bcrypt.hashSync('123456', salt) }
    user2 = { name: 'Mary Doe user 2', email: `${Date.now()}@gmail.com`, password: bcrypt.hashSync('122333', salt) }

    const users = [user1, user2];

    await app.db('users').insert(users);

    user1 = await app.db('users').where(user1).first();
    user2 = await app.db('users').where(user2).first();

    // remove o password para anexar ao token e não expor a senha
    delete user1.password

    // registra o token
    user1.token = jwt.encode(user1, SECRET);
    user2.token = jwt.encode(user2, SECRET);

    // Registrando contas
    acc1 = {
        name: `#AC${Date.now()}-AAC`,
        user_id: user1.id
    }

    acc2 = {
        name: `#AC${Date.now()}-AAC`,
        user_id: user2.id
    }

    const accs = [acc1, acc2];

    await app.db('accounts').insert(accs);

    acc1 = await app.db('accounts').where(acc1).first();
    acc2 = await app.db('accounts').where(acc2).first();

})

test('Deve retornar uma transação por ID', async () => {
    const t1 = {
        description: 'Prestação de serviços',
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        ammount: 350.34,
        type: 'I',
        acc_id: acc2.id
    }

    await app.db('transactions').insert(t1);
    // Recupera o registro do banco de dados para obter o id ddeste registro
    const transaction = await app.db('transactions').where(t1).first();
    // Faz a busca para testar a rota
    const res = await request(app)
        .get(`${MAIN_ROUTE}/${transaction.id}`)
        .set('authorization', `bearer ${user2.token}`);

    expect(res.status).toBe(200);
    expect(res.body.description).toEqual(t1.description);
    expect(res.body.date).toEqual(t1.date);
    expect(res.body.ammount).toEqual(t1.ammount);
    expect(res.body.type).toEqual(t1.type);
    expect(res.body.acc_id).toEqual(t1.acc_id);
})

test('Deve inserir uma transação com sucesso', async () => {

    const t1 = {
        description: 'Prestação de serviços',
        date: new Date(),
        ammount: 350.34,
        type: 'I',
        acc_id: acc2.id
    }

    const res = await request(app)
        .post(MAIN_ROUTE)
        .send(t1)
        .set('authorization', `bearer ${user1.token}`);

    expect(res.status).toBe(201);
    expect(res.body.description).toEqual(t1.description);

})

test('Deve listar todas as transações do usuário', async () => {
    // Insere no banco duas transações

    const t1 = {
        description: 'Serviços prestados',
        date: new Date(),
        ammount: 100,
        type: 'I',
        acc_id: acc1.id
    }

    const t2 = {
        description: 'Contas energia',
        date: new Date(),
        ammount: 300,
        type: 'O',
        acc_id: acc2.id
    }

    await app.db('transactions').insert([t1, t2]);

    const res = await request(app)
        .get(MAIN_ROUTE)
        .set('authorization', `bearer ${user1.token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].description).toEqual(t1.description);

})