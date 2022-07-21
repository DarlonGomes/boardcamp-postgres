import { categorySchema, gameSchema, customerSchema, rentalSchema, postRentalSchema } from '../databaseSchema/models/joiSchemas.js';

export function categoryValidation (req, res, next){

    const data = res.locals.cleanData;
    const validation = categorySchema.validate(data, {abortEarly:true});
    if(validation.error){
         return res.sendStatus(400)
    }
   
    next();
};

export function gameValidation ( req, res, next){
    const data = res.locals.cleanData;

    const validation = gameSchema.validate(data, {abortEarly: true});
    if(validation.error){
        return res.sendStatus(400);
    }
    next();
};

export function customerValidation (req, res, next){
    const data = res.locals.cleanData;
    const validation = customerSchema.validate(data, {abortEarly: true});
    if(validation.error){
        console.log(validation.error)
        return res.sendStatus(400);
    }
    next();
};

export function rentalValidation (req, res, next){
    const data = res.locals.cleanData;
    const validation = rentalSchema.validate(data, {abortEarly: true});
    if(validation.error){
        return res.sendStatus(400);
    }
    next();
};

export function openRentalValidation (req, res, next){
    const data = res.locals.cleanData;
    const validation = postRentalSchema.validate(data, {abortEarly:true});
    if(validation.error){
        return res.sendStatus(400);
    }
    next();
}