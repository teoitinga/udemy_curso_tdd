const express = require('express');
const ValidationError = require('../exceptions/ValidationError');


module.exports = (app) => {

    const router = express.Router();

    router.param('id', async (req, res, next) => {
        app.services.accounts.find({ id: req.params.id, user_id: req.user.id }).then(acc => {

            if (acc.length == 0) {
                throw new ValidationError(message = `Este recurso não pertecence ao usuário logado.`, status = 403);
            }
            next();
        }).catch(err => {
            next(err);

        });
    });

    router.post('/', async (req, res, next) => {

        app.services.accounts.save({ ...req.body, user_id: req.user.id })
            .then(
                response => {
                    return res.status(201).json(response)
                }
            ).catch(e => next(e));

    });

    router.get('/', async (req, res, next) => {
        try {
            const response = await app.services.accounts.find({ user_id: req.user.id })
            return res.status(200).json(response)

        } catch (e) {
            next(e);
        }

    });

    router.get('/:id', async (req, res, next) => {


        const response = await app.services.accounts.findOne({ id: req.params.id, user_id: req.user.id });

        if (response) {
            return res.status(200).json(response)

        } else {
            return next(new ValidationError(message = `Este recurso não pertecence ao usuário logado.`, status = 403));
        }


    });

    router.put('/:id', async (req, res, next) => {

        app.services.accounts.update(req.params.id, req.body).then(
            response => {
                return res.status(200).json(response)
            }
        ).catch(e => next(e));
    });

    router.delete('/:id', async (req, res, next) => {

        app.services.accounts.remove(req.params.id).then(
            response => {
                return res.status(204).json(response)
            }
        ).catch(e => next(e));
    });

    return router;
}