const express = require('express');
const ValidationError = require('../exceptions/ValidationError');


module.exports = (app) => {

    const router = express.Router();

    router.get('/', async (req, res, next) => {
        try {

            const result = await app.services.transactions.find(req.user.id);

            return res.status(200).json(result);
        } catch (e) {
            next(e)
        }

    });

    router.get('/:id', async (req, res, next) => {
        try {
            const result = await app.services.transactions.findById(req.user.id, req.params.id);

            return res.status(200).json({...result[0]});
        } catch (e) {
            next(e)
        }

    })

    router.post('/', async (req, res, next) => {
        try {
            const result = await app.services.transactions.save({ ...req.body });

            return res.status(201).json(result);
        } catch (e) {
            next(e);
        }
    })

    return router;
}