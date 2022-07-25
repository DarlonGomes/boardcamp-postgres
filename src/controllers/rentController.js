
import connection from "../databaseSchema/postgres.js";
import dayjs from "dayjs";

export async function getRentals(req,res){

const request= req.query

let response;
switch (true) {
    case request.startDate !== undefined:
        response = await connection.query(`
        SELECT r.*, 
        jsonb_build_object(
            'id, c.id,
            'name', c.name
        ) AS customer,
        jsonb_build_object(
            'id', g.id,
            'name', g.name,
            'categoryId', g."categoryId",
            'categoryName', ca.name
        ) AS game
        FROM rentals r
        JOIN customers c ON "customerId" = c.id
        JOIN games g ON "gameId" = g.id
        JOIN categories ca ON "categoryId" = ca.id
        WHERE "rentDate" >= ${request.startDate}
        `);
        break;
    case request.status !== undefined:
        if(request.status == 'open'){
            response = await connection.query(`
            SELECT r.*,
            jsonb_build_object(
                'id', c.id,
                'name', c.name
            ) as customer,
            jsonb_build_object(
                'id', g.id,
                'name', g.name,
                'categoryId', g."categoryId",
                'categoryName', ca.name
            )as game 
            FROM rentals r 
            JOIN customers c ON "customerId"=c.id 
            JOIN games g ON "gameId"=g.id 
            JOIN categories ca ON "categoryId"=ca.id
            WHERE "returnDate" IS NOT null
            `);
        }else{
            response = await connection.query(`
            SELECT r.*,
            jsonb_build_object(
                'id', c.id,
                'name', c.name
            ) as customer,
            jsonb_build_object(
                'id', g.id,
                'name', g.name,
                'categoryId', g."categoryId",
                'categoryName', ca.name
            )as game 
            FROM rentals r 
            JOIN customers c ON "customerId"=c.id 
            JOIN games g ON "gameId"=g.id 
            JOIN categories ca ON "categoryId"=ca.id
            WHERE "returnDate" IS null
            `);
        }

        break;
    case request.order !== undefined && request.desc !== undefined:
        response = await connection.query(`
        SELECT r.*,
        jsonb_build_object(
            'id', c.id,
            'name', c.name
        ) as customer,
        jsonb_build_object(
            'id', g.id,
            'name', g.name,
            'categoryId', g."categoryId",
            'categoryName', ca.name
        )as game 
        FROM rentals r 
        JOIN customers c ON "customerId"=c.id 
        JOIN games g ON "gameId"=g.id 
        JOIN categories ca ON "categoryId"=ca.id
        ORDER BY ${request.order}
        DESC
        `);
        break;
    case request.order !== undefined:
        response = await connection.query(`
        SELECT r.*,
        jsonb_build_object(
            'id', c.id,
            'name', c.name
        ) as customer,
        jsonb_build_object(
            'id', g.id,
            'name', g.name,
            'categoryId', g."categoryId",
            'categoryName', ca.name
        )as game 
        FROM rentals r 
        JOIN customers c ON "customerId"=c.id 
        JOIN games g ON "gameId"=g.id 
        JOIN categories ca ON "categoryId"=ca.id
        ORDER BY ${request.order}`);
        break;
    case request.offset !== undefined && request.limit !== undefined:
        response = await connection.query(`
        SELECT r.*,
        jsonb_build_object(
            'id', c.id,
            'name', c.name
        ) as customer,
        jsonb_build_object(
            'id', g.id,
            'name', g.name,
            'categoryId', g."categoryId",
            'categoryName', ca.name
        )as game 
        FROM rentals r 
        JOIN customers c ON "customerId"=c.id 
        JOIN games g ON "gameId"=g.id 
        JOIN categories ca ON "categoryId"=ca.id
        LIMIT $1
        OFFSET $2`, [request.limit, request.offset]);
        break;
    case request.limit !== undefined:
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
        )as game 
        FROM rentals r 
        JOIN customers c ON "customerId"=c.id 
        JOIN games g ON "gameId"=g.id 
        JOIN categories ca ON "categoryId"=ca.id
        LIMIT $1`, [request.limit]);
        break;
    case request.offset !== undefined:
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
        )as game 
        FROM rentals r 
        JOIN customers c ON "customerId"=c.id 
        JOIN games g ON "gameId"=g.id 
        JOIN categories ca ON "categoryId"=ca.id
        OFFSET $1`, [request.offset]);
        break;
    case request.customerId !== undefined:
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
        )as game FROM rentals r 
        JOIN customers c ON "customerId"=c.id 
        JOIN games g ON "gameId"=g.id 
        JOIN categories ca ON "categoryId"=ca.id
        WHERE "customerId" = $1`,[request.customerId]);
        break;
    case request.gameId !== undefined:
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
        )as game FROM rentals r 
        JOIN customers c ON "customerId"=c.id 
        JOIN games g ON "gameId"=g.id 
        JOIN categories ca ON "categoryId"=ca.id
        WHERE "gameId" = $1`, [request.gameId]);
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
        )as game FROM rentals r
        JOIN customers c ON "customerId"=c.id 
        JOIN games g ON "gameId"=g.id 
        JOIN categories ca ON "categoryId"=ca.id`);
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
    const diffOnRent = diff - item[0].daysRented;

    if(diff > 0){
        fee = (item[0].originalPrice / item[0].daysRented) * diffOnRent;
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

export async function getMetrics (req,res){
    const request = req.query;
    let response;
    let info;
    let fee;
    let rentals;
    try {
        switch (true) {
            case request.startDate !== undefined && request.endDate !== undefined:
                 nfo = await connection.query(`
                SELECT
                SUM("originalPrice")::double precision AS base
                FROM rentals 
                WHERE "rentDate" >= $1 AND "rentDate" <= $2
                `, [request.startDate, request.endDate]);
                fee = await connection.query(`
                SELECT
                SUM("delayFee")::double precision AS delay
                FROM rentals 
                WHERE "rentDate" >= $1 AND "rentDate" <= $2
                `, [request.startDate, request.endDate]);
                rentals = await connection.query(`
                SELECT
                COUNT(id)::double precision AS average
                FROM rentals 
                WHERE "rentDate" >= $1 AND "rentDate" <= $2
                `, [request.startDate, request.endDate]);
                break;
            case request.startDate !== undefined :
                info = await connection.query(`
                SELECT
                SUM("originalPrice")::double precision AS base
                FROM rentals
                WHERE "rentDate" >= $1
                `, [request.startDate]);
                fee = await connection.query(`
                SELECT
                SUM("delayFee")::double precision AS delay
                FROM rentals
                WHERE "rentDate" >= $1
                `, [request.startDate]);
                rentals = await connection.query(`
                SELECT
                COUNT(id)::double precision AS average
                FROM rentals
                WHERE "rentDate" >= $1
                `, [request.startDate]);
                break;
            case request.endDate !== undefined:
                info = await connection.query(`
                SELECT
                SUM("originalPrice")::double precision AS base
                FROM rentals
                WHERE "rentDate" <= $1
                `, [request.endDate]);
                fee = await connection.query(`
                SELECT
                SUM("delayFee")::double precision AS delay
                FROM rentals
                WHERE "rentDate" <= $1
                `, [request.endDate]);
                rentals = await connection.query(`
                SELECT
                COUNT(id)::double precision AS average
                FROM rentals
                WHERE "rentDate" <= $1`
                , [request.endDate]);
                break;
            default:
                info = await connection.query(`
                SELECT
                SUM("originalPrice")::double precision AS base
                FROM rentals
                `)
                fee = await connection.query(`
                SELECT
                SUM("delayFee")::double precision AS delay
                FROM rentals
                `);
                rentals = await connection.query(`
                SELECT
                COUNT(id)::double precision AS average
                FROM rentals`);
                break;
        }
        response = {
            revenue: info.rows[0].base + fee.rows[0].delay ,
            rentals: rentals.rows[0].average,
            average: (info.rows[0].base + fee.rows[0].delay) / rentals.rows[0].average
        }
        return res.send(response).status(200);
    } catch (error) {
        return res.send(error).status(500);
    }
}