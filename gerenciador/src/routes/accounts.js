const express = require('express');


module.exports = (app) => {

    const router = express.Router();

    router.post('/', async (req, res, next) => {

        app.services.accounts.save(req.body)
            .then(
                response => {
                    return res.status(201).json(response)
                }
            ).catch(e => next(e));

    });

    router.get('/', async (req, res, next) => {
        app.services.accounts.findAll(req.body)
            .then(
                response => {
                    return res.status(200).json(response)
                }
            ).catch(e => next(e));
    });

    router.get('/:id', async (req, res) => {

        app.services.accounts.find({ id: req.params.id }).then(
            response => {
                return res.status(200).json(response)
            }
        ).catch(e => next(e));
    });

    router.put('/:id', async (req, res) => {

        app.services.accounts.update(req.params.id, req.body).then(
            response => {
                return res.status(200).json(response)
            }
        ).catch(e => next(e));
    });

    router.delete('/:id', async (req, res) => {

        app.services.accounts.remove(req.params.id).then(
            response => {
                return res.status(204).json(response)
            }
        ).catch(e => next(e));
    });

    return router;
}