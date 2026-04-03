const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'root,locked',
    database : 'project_hub',
    waitForConnections : true, 
    connectionLimit : 10, // max of connection a pool can handle at the same time.
    queueLimit : 0 //Maximum number of requests allowed to wait in the queue for a free connection.
});

async function testConnection(){
    try{
        const connection = await pool.getConnection(); // get one connection from the pool
        console.log(`✅ Connected to mySQL .`);
        connection.release(); // send it back to the pool
        return true;
    } 
    catch(connectionError){
        console.log(`mySQL : ${connectionError.message}`);
        return false;
    }   
}

module.exports = {
    pool , testConnection
}