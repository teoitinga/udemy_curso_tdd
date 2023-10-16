module.exports = (app) => {
    const findAll = (filter = {}) => {
        return app.db('users').where(filter).select();
    }

    const save = async (user) =>{
        
        if(!user.name) return { error: 'Nome do usuário é obrigatório'};
        if(!user.email) return { error: 'E-mail do usuário é obrigatório'};
        if(!user.password) return { error: 'Senha é obrigatória para o usuário.'};

        const userdb = await findAll({email: user.email});
        if(userdb && userdb.length > 0) return {error: 'Já existe usuário com este e-mail.'};

        await app.db('users').insert(user, '*');
        
        const response = await app.db('users').where({
            name: user.name,
            email:  user.email,
            password: user.password
          }).select();

        return response;
    }

    return { 
        findAll,
        save
    }
};