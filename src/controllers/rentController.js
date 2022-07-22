
import connection from "../databaseSchema/postgres.js";
import dayjs from "dayjs";

export async function getRentals(req,res){
let response;
switch (true) {
    case req.query.customerId !== undefined:
        response = await connection.query(`SELECT r.*,
        jsonb_build_object(
            'id', c.id,
            'name', c.name
        ) as customer,
        jsonb_build_object(
            'id', g.id,
            'name', g.name,
            'categoryId', g."categoryId",
            'categoryName', ca.name
        )as game FROM rentals r JOIN customers c ON "customerId"=c.id JOIN games g ON "gameId"=g.id JOIN categories ca ON "categoryId"=ca.id
         WHERE "customerId" = $1`,[req.query.customerId]);
        break;
    case req.query.gameId !== undefined:
        response = await connection.query(`SELECT r.*,
        jsonb_build_object(
            'id', c.id,
            'name', c.name
        ) as customer,
        jsonb_build_object(
            'id', g.id,
            'name', g.name,
            'categoryId', g."categoryId",
            'categoryName', ca.name
        )as game FROM rentals r JOIN customers c ON "customerId"=c.id JOIN games g ON "gameId"=g.id JOIN categories ca ON "categoryId"=ca.id
         WHERE "gameId" = $1`, [req.query.gameId]);
        break;
    default:
        response = await connection.query(`SELECT r.*,
        jsonb_build_object(
            'id', c.id,
            'name', c.name
        ) as customer,
        jsonb_build_object(
            'id', g.id,
            'name', g.name,
            'categoryId', g."categoryId",
            'categoryName', ca.name
        )as game FROM rentals r JOIN customers c ON "customerId"=c.id JOIN games g ON "gameId"=g.id JOIN categories ca ON "categoryId"=ca.id`);
        break;
}

    return res.send(response.rows).status(200);
}

export async function openRentals (req,res){
    const {customerId, gameId, daysRented} = res.locals.cleanData;
    const date = dayjs().format('YYYY-MM-DD');
    
    try {
        const customer = await connection.query('SELECT * FROM customers WHERE id=$1', [customerId]);
        if(customer.rows.length === 0) return res.sendStatus(400);

        const game = await connection.query('SELECT * FROM games WHERE id=$1', [gameId])
        if(game.rows.length === 0 ) return res.sendStatus(400); //Add validation where rents exceeds gameStock
        
        const basePrice = game.rows[0].pricePerDay;
        const originalPrice = basePrice * daysRented;
        
        await connection.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)',[customerId, gameId, date, daysRented, null, originalPrice, null]);
       
        return res.sendStatus(201);
    } catch (error) {
        return res.send(error).status(500);
    }
    
    
}

export async function finishRentals (req,res){
const {id} = req.params;
const today = dayjs().format('YYYY-MM-DD');
let fee = null;

try {
    const { rows: item } = await connection.query('SELECT *  FROM rentals  WHERE id = $1', [id]);

    if(item.length === 0 ) return res.sendStatus(404);
    if(item[0].returnDate !== null ) return res.sendStatus(404);

    const diff = dayjs().diff(item[0].rentDate, 'day');

    if(diff > 0){
        fee = (item[0].originalPrice / item[0].daysRented) * diff;
    }

    await connection.query('UPDATE rentals SET "returnDate"= $1, "delayFee"=$2 WHERE id=$3', [today, fee, id])
    return res.sendStatus(200);
} catch (error) {
    return res.sendStatus(500);
}
}

export async function deleteRentals (req,res){
    const {id} = req.params;

    try {
        const {rows: item} = await connection.query('SELECT * FROM rentals WHERE id = $1', [id]);
        
        if(item.length === 0) return res.sendStatus(404);
        if(item[0].returnDate !== null) return res.sendStatus(400);
        
        await connection.query('DELETE FROM rentals WHERE id= $1', [id]);
        return res.sendStatus(200);
    } catch (error) {
        return res.send(error).status(500);
    }
    
}