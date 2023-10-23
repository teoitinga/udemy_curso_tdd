const express = require('express');
const ValidationError = require('../exceptions/ValidationError');


module.exports = (app) => {

    const router = express.Router();

    router.get('/', async (req, res, next)=>{
        try{
            const result = await app.services.transactions.find(req.user.id);
            return res.status(200).json(result);
        }catch(e){
            next(e)
        }

    });

    return router;
}