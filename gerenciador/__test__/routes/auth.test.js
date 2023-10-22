const request = require('supertest')

const app = require('../../src/app')
test('Deve criar o usuário via sigup', async ()=>{
      // Cria o usuário
      const mail = `${Date.now()}@mail.com`
      const user = {name: 'Jonh Doe', email: mail, password: '123456'}
      const result = await request(app).post('/auth/signup')
      .send(user);
  
      expect(result.status).toBe(201);
      expect(result.body.name).toBe(user.name);
      expect(result.body).not.toHaveProperty('password');
})

test('Deve receber token ao logar', async () => {
    // Cria o usuário
    const mail = `${Date.now()}@mail.com`
    const user = { name: 'Jonh Doe', email: mail, password: '123456' }

    await app.services.user.save(user);

    // tenta autenticar
    const res = await request(app)
        .post('/auth/sigin')
        .send({ email: user.email, password: user.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token')
})

test('Não deve autenticar usuário com a senha incorreta', async ()=>{
    // Cria o usuário
    const mail = `${Date.now()}@mail.com`
    const user = { name: 'Jonh Doe', email: mail, password: '123456' }

    await app.services.user.save(user);

     // tenta autenticar
     const res = await request(app)
     .post('/auth/sigin')
     .send({ email: user.email, password: `${user.password}ahja` });    
     
     expect(res.status).toBe(400);
     expect(res.body.error).toEqual('Senha incorreta.');
})

test('Não deve autenticar usuário inexistente', async ()=>{

    // Cria o usuário
    const mail = `${Date.now()}@mail.com`
    const user = { name: 'Jonh Doe', email: mail, password: '123456' }

     // tenta autenticar
     const res = await request(app)
     .post('/auth/sigin')
     .send({ email: user.email, password: `${user.password}ahja` });    
     
     expect(res.status).toBe(404);
     expect(res.body.error).toEqual('Usuário não existe.');
})

test('Não deve acessar uma rota protegida sem autenticação', async ()=>{
    const response = await request(app).get('/v1/users');

    expect(response.status).toBe(401);

})