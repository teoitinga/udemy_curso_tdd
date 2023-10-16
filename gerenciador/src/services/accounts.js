module.exports = (app) => {

    const save = async (account) =>{
        
        if(!account.name) return { error: 'Nome da conta é obrigatório'};


        await app.db('accounts').insert(account, '*');
        
        const response = await app.db('accounts').where({
            name: account.name,
          }).select();

          return response;
    }

    return { 
        save
    }
};