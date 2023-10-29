const ValidationError = require('../exceptions/ValidationError');
const accounts = require('./accounts');
const moment = require('moment');


module.exports = (app) => {
    
    const adjusts = (obj) => {

        obj.date = moment(obj.date).format("YYYY-MM-DD HH:mm:ss");
        obj.ammount = parseFloat(obj.ammount);
        return obj;

    }
    const find = async (userid, filter = {}) => {
        return await app.db('transactions')
            .join('accounts', 'accounts.id', 'acc_id')
            .where(filter)
            .andWhere('accounts.user_id', '=', userid)
            .select().map(r => adjusts(r));
    }

    const findById = async (userid, id) => {
        return await app.db('transactions')
            .join('accounts', 'accounts.id', 'transactions.acc_id')
            .where({
                'transactions.id': id,
                'accounts.user_id': userid
            })
            .select('transactions.*').map(r => adjusts(r));
    }

    const findOne = async (userid, filter = {}) => {
        return await app.db('transactions')
            .join('accounts', 'accounts.id', 'acc_id')
            .where(filter)
            .andWhere('accounts.user_id', '=', userid)
            .first().map(r => adjusts(r));
    }

    const save = async (transaction) => {
        // Registra a transação no no banco de dados

        transaction.date = moment(transaction.date).format("YYYY-MM-DD HH:mm:ss");

        await app.db('transactions').insert(transaction, '*');

        const response = await app.db('transactions').where({
            description: transaction.description,
            date: transaction.date,
            ammount: transaction.ammount,
            type: transaction.type,
            acc_id: transaction.acc_id,
        }).first();

        return response;
    };

    return {
        findOne,
        findById,
        save,
        find
    }
}