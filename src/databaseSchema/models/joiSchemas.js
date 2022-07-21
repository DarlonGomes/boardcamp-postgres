import Joi from "joi";

export const categorySchema = Joi.object({
    name: Joi.string().min(1).required()
});
