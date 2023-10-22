const ValidationError = require('../exceptions/ValidationError');

module.exports = (app) => {

    const save = async (account) => {

        if (!account.name) throw new ValidationError('Nome da conta é obrigatório');


        await app.db('accounts').insert(account, '*');

        const response = await app.db('accounts').where({
            name: account.name,
        }).first();

        return response;
    }
    
    const findAll = async () => {
        
        const response = await app.db('accounts');

        return response;
    }

    const find = async (filter = {}) => {
        const response = await app.db('accounts').where(filter).first();
        
        return response;
    }
    
    const remove = async (id) => {
        const response = await app.db('accounts').where({id}).del();
        
        return response;
    }

    const update = async (id, body) => {
        await app.db('accounts').where({id}).update(body);
        const response = await app.db('accounts').where({id}).first();
        
        return response;
    }

    return {
        save,
        findAll,
        find,
        update,
        remove
    }
};