
import connection from "../databaseSchema/postgres.js";

export async function getGames (req,res){
    const request = req.query;
    console.log(request)
    let response;
    //I'd decided to make a few tests with switch/case and add three new search methods
    try {
        switch (true) {
            case request.categories !== undefined:
                response = await connection.query('SELECT * FROM games WHERE LOWER(categoryName) LIKE LOWER($1)', [`${request.categories}%`]);
                break;
            case request.pricePerDay !== undefined:
                response = await connection.query('SELECT * FROM games WHERE pricePerDay = $1', [request.pricePerDay]);
                break;
            case request.name !== undefined:
                response = await connection.query('SELECT * FROM games WHERE LOWER(name) LIKE LOWER($1)', [`${request.name}%`]);
                break;
            default:
                response = await connection.query('SELECT * FROM games');
                break;
        }
        if(response.rows.length === 0){
            return res.status(404).send("Nothing was found...");
        }
        return res.send(response.rows).status(200);
    } catch (error) {
        return res.send(error).status(500);
    }
}

export async function postGames (req,res){
    const {name, image, stockTotal, categoryId, pricePerDay} = res.locals.cleanData;

    try {
        const checkCategory = await connection.query('SELECT id FROM categories WHERE id = $1', [categoryId]);
        const checkName = await connection.query(`SELECT * FROM games WHERE name = $1`, [name]);

        if( checkCategory.rowCount === 0) return res.sendStatus(400);
        if( checkName.rowCount > 0) return res.sendStatus(409);

        await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay])
        return res.sendStatus(200);
    } catch (error) {
        return res.sendStatus(500);
    }
}