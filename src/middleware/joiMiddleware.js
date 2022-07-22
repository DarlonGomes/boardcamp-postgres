import { categorySchema, gameSchema, customerSchema, returnSchema, postRentalSchema } from '../databaseSchema/models/joiSchemas.js';
import connection from '../databaseSchema/postgres.js';

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

export function returnValidation (req, res, next){
    const id = req.params;
    const validation = returnSchema.validate(id, {abortEarly: true});
    if(validation.error){
        return res.sendStatus(400);
    }
    next();
};

export async function openRentalValidation (req, res, next){
    const data = res.locals.cleanData;
    const validation = postRentalSchema.validate(data, {abortEarly:true});
    if(validation.error){
        return res.sendStatus(400);
    }
    const {rows : game} = await connection.query(`SELECT * FROM games WHERE id=$1`, [data.gameId]);
    const {rows : rent} = await connection.query(`SELECT * FROM rentals WHERE "gameId" = $1`, [data.gameId]);
    const qty = game[0].stockTotal;
    const limit = rent.length;
    if(limit - qty >= 0) return res.send("We ran out of stock.").status(400);
    next();
}