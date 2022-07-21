import { categorySchema } from '../databaseSchema/models/joiSchemas.js';

export function dataValidation (req, res, next){

    const data = res.locals.cleanData;
    let validation;

    switch (true) {
        case data.price !== undefined:
            
            break;
    
        default:
            validation = categorySchema.validate(data, {abortEarly:true});
            if(validation.error){
                 return res.sendStatus(400)
            }
            break;
    }
   
    next();
}