import connection from "../databaseSchema/postgres.js";


export async function getCategories (req,res){
    const request = req.query;
    let response;
    try {
        switch (true) {
            case request.order !== undefined && request.desc !== undefined:
                response = await connection.query(`
                SELECT * FROM categories
                ORDER BY $1
                DESC
                `, [request.order]);
                break;
            case request.order !== undefined:
                response = await connection.query(`
                SELECT * FROM categories
                ORDER BY $1
                `, [request.order]);
                break;
            case request.desc !== undefined:
            case request.offset !== undefined && request.limit !== undefined:
                response = await connection.query(`
                SELECT * FROM categories
                OFFSET $1
                LIMIT $2`,
                [request.offset, request.limit]);
                break;
            case request.offset !== undefined :
                response = await connection.query(`
                SELECT * FROM categories
                OFFSET $1`,
                [request.offset]);
                break;
            case request.limit !== undefined:
                response = await connection.query(`
                SELECT * FROM categories
                LIMIT $1`,
                [request.limit]);
                break;
            default:
                response = await connection.query(`
                SELECT * FROM categories`);
                break;
        }
        res.send(response.rows).status(200);
    } catch (error) {
        res.send(error).status(500);
    }
}

export async function postCategories (req,res){
    const {name} = res.locals.cleanData;
    try {
        const checkIfExist = await connection.query(`SELECT * FROM categories WHERE name = $1`, [name]);
       
        if(checkIfExist.rowCount ) return res.sendStatus(409);

        await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);
        res.sendStatus(201);
        
    } catch (error) {
        res.send(error).status(500);
    }
}