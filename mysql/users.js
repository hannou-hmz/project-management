const database = require('./db');
const bcrypt = require('bcrypt');
const SALT_COUNT = 8;

async function createUser(role , full_name , age , email , department , password){
    const encPassword = await bcrypt.hash(password , SALT_COUNT);
    try{
        const sql = "INSERT INTO users(role , full_name , age , email , department , password) VALUES(?,?,?,?,?,?)";
        const [result] = await database.pool.execute(sql , [role , full_name , age , email , department , encPassword]);
        return result.affectedRows; 
    }
    catch(e){
        console.log(`Storing user error : ${e.message}`);
        return false;
    }
}

async function getUser(role , email , password){
    
    try{
        const sql = "SELECT * FROM users WHERE role = ? AND email = ?";
        const [rows] = await database.pool.execute(sql, [role , email]);
        if (rows.length > 0) {
            const unhashPassword = await bcrypt.compare(password , rows[0].password);
            if(unhashPassword){
                console.log('User found in database.')
                return rows[0];
            }
            else{
                console.log('User is not in database!!!')
                return false;
            }
        } else {
            return null;
        }
    }
    
    catch (e) {
        console.log(`Finding user error : ${e.message}`);
        return null;
    }
}




module.exports = {
    createUser,
    getUser
}