
import connection from "../databaseSchema/postgres.js";
import dayjs from "dayjs";

export async function getRentals(req,res){
const response = await connection.query('SELECT * FROM rentals')
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



}

export async function deleteRentals (req,res){


    
}