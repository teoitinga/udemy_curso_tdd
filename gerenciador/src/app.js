const app = require('express')();
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexfile');


//TODO Criar chaveamento dinâmico
app.db = knex(knexfile.test);

consign({ cwd: 'src', verbose: false })
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./services')
    .then('./routes')
    .then('./config/router.js')
    .into(app)

app.get('/', (req, res) => {
    res.status(200).send('Sistema de Gerenciamento de contas')
})

// Middleware gerenciador de Erros
app.use((err, req, res, next)=>{
    const { name, message, stack } = err;
    
    if(name === 'ValidationError') res.status(err.status).json({error: err.message})
    else res.status(500).json({name, message, stack})
    
    next(err);
})
/*
app.db
.on('query', (query) => {
    console.log({ sql: query.sql, bindings: query.bindings ? query.bindings.join(', ') : '' });
})
.on('query-response', (response) => {
    console.log(response);
})
.on('error', (error) => {
    console.log(error)
})
*/
module.exports = app;