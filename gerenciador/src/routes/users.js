const express = require('express');

module.exports = (app) => {

    const router = express.Router();

    router.get('/', async (req, res, next) => {
        const response = await app.services.user.findAll();
        res.status(200).json(response);
        next();
    });

    router.post('/', async (req, res, next) => {
        
        try{
            const response = await app.services.user.save(req.body);
            return res.status(201).json(response[0])
        }catch(e){
            next(e)
        }

    });

    return router;
}