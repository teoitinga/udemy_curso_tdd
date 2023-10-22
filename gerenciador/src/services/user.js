const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../exceptions/ValidationError');

module.exports = (app) => {

    FIELDS = ['id', 'name', 'email']
    
    const findAll = () => {
        return app.db('users').select(FIELDS);
    }

    const getPswHash = (password)=>{
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    const save = async (user) =>{
        
        if(!user.name) throw new ValidationError( 'Nome do usuário é obrigatório');
        if(!user.email) throw new ValidationError( 'E-mail do usuário é obrigatório');
        if(!user.password) throw new ValidationError( 'Senha é obrigatória para o usuário.');

        // Verifica se já existe o e-mail informado
        const userdb = await findOne({ email: user.email });

        if( userdb ) throw new ValidationError(  'Já existe usuário com este e-mail.' );

        const newuser = { ...user };
        newuser.password = getPswHash(user.password);

        await app.db('users').insert(newuser, '*');
        
        const response = await app.db('users').where({
            name: newuser.name,
            email:  newuser.email
          })
          .select(FIELDS);

        return response;
    }

    const findOne = async (filter = {}) => {
        const response = await app.db('users').where(filter).first();
        
        return response;
    }
    return { 
        findAll,
        save,
        findOne
    }
};