const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../exceptions/ValidationError');


// TODO Resolver esta duplicação de variável. Colocar em aqrquivo.env. Atualmente está em? config/passport.js
const SECRET = 'sdasjhdjew43987ddhskdjs';

module.exports = (app) => {
    const router = express.Router();

    router.post('/sigin', async (req, res, next) => {

        const user = await app.services.user.findOne({ email: req.body.email })

        // Verifica se existe o usuário informado
        if (!user) {
            return next(new ValidationError(message = 'Usuário não existe.', status = 404));
        }

        // Verifica se a senha está correta caso exista o usuário informado.
        if (bcrypt.compareSync(req.body.password, user.password)) {

            const payload = {
                id: user.id,
                name: user.name,
                mail: user.email
            }

            const token = jwt.encode(payload, SECRET);
            return res.status(200).json({ token });

        } else {
            return next(new ValidationError(message = 'Senha incorreta.', status = 400));
        }



    });

    router.post('/signup', async (req, res, next) => {
        try{
            const response = await app.services.user.save(req.body);
            return res.status(201).json(response[0]);
        }catch(e){
            next(e);
        }
    })

    return router;

}