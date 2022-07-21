import connection from "../databaseSchema/postgres.js";


export async function getCategories (req,res){
    try {
        const response = await connection.query('SELECT * FROM categories');
        res.send(response.rows).status(200);
    } catch (error) {
        res.send(error).status(500);
    }
}

export async function postCategories (req,res){
    const {name} = res.locals.cleanData;
    try {
        const checkIfExist = await connection.query('SELECT * FROM categories WHERE name = $1', [name]);
       
        if(checkIfExist.rowCount ) return res.sendStatus(409);

        await connection.query('INSERT INTO categories (name) VALUES ($1)', [name]);
        res.sendStatus(201);
        
    } catch (error) {
        res.send(error).status(500);
    }
}