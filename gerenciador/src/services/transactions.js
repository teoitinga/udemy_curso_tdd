const ValidationError = require('../exceptions/ValidationError');
const accounts = require('./accounts');

module.exports = (app) => {

    const find = async (userid, filter = {}) => {
        return await app.db('transactions')
            .join('accounts', 'accounts.id', 'acc_id')
            .where(filter)
            .andWhere('accounts.user_id', '=', userid)
            .select();
    }

    return {
        find
    }
}