import connection from "../databaseSchema/postgres.js";


export async function getCustomer (req,res){
    const {id} = req.params;
    const request = req.query;
    let response;
    
    try {
        switch (true) {
            case request.order !== undefined && request.desc !== undefined:
                response = await connection.query(`
                SELECT * FROM customers
                ORDER BY ${request.order}
                DESC
                `);
            break;
            case request.order !== undefined:
                response = await connection.query(`
                SELECT * FROM customers
                ORDER BY ${request.order}
                `);
            break;
            case request.offset !== undefined && request.limit !== undefined:
                response = await connection.query(`
                SELECT * FROM customers
                OFFSET $1
                LIMIT $2`,
                [request.offset, request.limit]);
            break;
            case request.offset !== undefined :
                response = await connection.query(`
                SELECT * FROM customers
                OFFSET $1`,
                [request.offset]);
            break;
            case request.limit !== undefined:
                response = await connection.query(`
                SELECT * FROM customers
                LIMIT $1`,
                [request.limit]);
            break;
            case id !== undefined:
                response = await connection.query(`
                SELECT * FROM customers 
                WHERE id = $1`,
                [id]);
                if(response.rows.length === 0) return res.sendStatus(404);
            break;
            case request.name !== undefined:
                response = await connection.query(`
                SELECT * FROM customers 
                WHERE LOWER(name) 
                LIKE LOWER($1)`, 
                [`${query.name}%`]);
            break;
            case request.cpf !== undefined:
                response = await connection.query(`
                SELECT * FROM customers 
                WHERE cpf 
                LIKE $1`, 
                [`${query.cpf}%`]);
            break;
            default:
                response = await connection.query(`
                SELECT * FROM customers`);
            break;
        }
    return res.send(response.rows).status(200);
    } catch (error) {
        return res.sendStatus(500);
    }
};

export async function postCustomer (req,res){
    const {name, phone, cpf, birthday} = res.locals.cleanData;
    try {
        const checkCPF = await connection.query('SELECT * FROM customers WHERE cpf = $1', [cpf]);
        if(checkCPF.rows.length !== 0) return res.sendStatus(409);
        
        await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [name, phone, cpf, birthday]);
        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function updateCustomer(req,res){
    const {id} = req.params;
    const {name, phone, cpf, birthday} = res.locals.cleanData;
    try {
        const checkCPF = await connection.query('SELECT id FROM customers WHERE cpf = $1', [cpf]);
        if(checkCPF.rows[0].id != id){
            
            return res.sendStatus(409);
        }else{
            await connection.query('UPDATE customers set name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5', [name, phone, cpf, birthday, id]);
            return res.sendStatus(200);
        }
    } catch (error) {
        return res.sendStatus(500);
    }
}