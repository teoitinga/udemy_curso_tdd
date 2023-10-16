const app = require('express')();
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexfile');
// const knexlogger = require('knex-logger');

//TODO Criar chaveamento dinâmico
app.db = knex(knexfile.test);

// app.use(knexlogger(app.db));

consign({ cwd: 'src', verbose: false })
    .include('./config/middlewares.js')
    .then('./services')
    .then('./routes')
    .then('./config/routes.js')
    .into(app)

app.get('/', (req, res) => {
    res.status(200).send('Sistema de Gerenciamento de contas')
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