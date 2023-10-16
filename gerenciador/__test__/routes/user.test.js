const request = require('supertest')

const app = require('../../src/app')

test('Deve listar todos os usuario', async ()=>{

    const result = await request(app).get('/users');

    expect(result.status).toBe(200);
    expect(result.body.length).toBeGreaterThanOrEqual(0);
}) 

test('Deve inserir usuário com sucesso', async ()=>{

    const mail = `${Date.now()}@mail.com`
    const user = {name: 'Jonh Doe', email: mail, password: '123456'}
    const result = await request(app).post('/users').send(user);

    expect(result.status).toBe(201);
    expect(result.body.name).toBe(user.name);
}) 
test('Não deve inserir usuário sem nome', async ()=>{

    const mail = `${Date.now()}@mail.com`
    const user = {email: mail, password: '123456'}

    const result = await request(app).post('/users').send(user);

    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Nome do usuário é obrigatório');
}) 
test('Não deve inserir usuário sem emal', async ()=>{
    
    const mail = `${Date.now()}@mail.com`
    const user = {name: 'Jonh Doe', password: '123456'}

    const result =  await request(app).post('/users').send(user);

    expect(result.status).toBe(400);
    expect(result.body.error).toBe('E-mail do usuário é obrigatório');
}) 
test('Não deve inserir usuário sem senha', async ()=>{
    
    const mail = `${Date.now()}@mail.com`
    const user = {name: 'Jonh Doe', email: mail}

    const result =  await request(app).post('/users').send(user);

    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Senha é obrigatória para o usuário.');
}) 
test('Não deve inserir usuário com e-mail já existente', async ()=>{
    
    const mail = `123456@mail.com`
    const user1 = {name: 'Jonh Doe One', email: mail, password: '123456'}
    const user = {name: 'Jonh Doe Twos', email: mail, password: '123456'}

    let result =  await request(app).post('/users').send(user1);
    result =  await request(app).post('/users').send(user);
 
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Já existe usuário com este e-mail.');
}) 