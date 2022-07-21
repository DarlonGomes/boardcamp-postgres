import Joi from "joi";
import dayjs from "dayjs";

let now = dayjs();

const minAge = new Date(now - (1000 * 60 * 60 * 24 * 365 * 14));

export const categorySchema = Joi.object({
    name: Joi.string().min(1).required()
});

// Make sure to review pattern documentation with regex
export const gameSchema = Joi.object({
    name: Joi.string().min(1).required(),
    image: Joi.string().pattern(/(http(s?):)([/|.|\w|\s|-])*.(?:jpg|gif|png)/).required(),
    stockTotal: Joi.number().min(1).required(),
    categoryId: Joi.number().required(),
    pricePerDay: Joi.number().min(1).required()
})

export const customerSchema = Joi.object({
    name: Joi.string().min(1).required(),
    phone: Joi.string().pattern(new RegExp('[0-9]{10,11}')).required(),
    cpf: Joi.string().pattern(new RegExp('[0-9]{11}')).required(),
    birthday: Joi.date().max(minAge).required()
});

export const returnSchema = Joi.object({
  id: Joi.number().required()
});

export const postRentalSchema = Joi.object({
    customerId:Joi.number().min(1).required(),
    gameId: Joi.number().min(1).required(),
    daysRented: Joi.number().min(1).required()
})