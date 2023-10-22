const bodyparser = require('body-parser');
const knexlogger = require('knex-logger');

module.exports = (app) => {
    app.use(bodyparser.json());
    app.use(knexlogger(app.db));
}
