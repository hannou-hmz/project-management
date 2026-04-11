const database = require('./db');
const bcrypt = require('bcrypt');
const SALT_COUNT = 8;

async function createUser(role , full_name , age , email , department , password){
    const encPassword = await bcrypt.hash(password , SALT_COUNT);
    try{
        const sql = "INSERT INTO users(role , full_name , age , email , department , password) VALUES(?,?,?,?,?,?)";
        const [result] = await database.pool.execute(sql , [role , full_name , age , email , department , encPassword]);
        if(result.affectedRows){
            console.log(`User created ✅`);
            return result;
        } 
    }
    catch(e){
        console.log(`Storing user error : ${e.message}`);
        return false;
    }
}

async function getAdmin(email , password){
    try{
        const sql = "SELECT * FROM admins WHERE email = ?";
        const [result] = await database.pool.execute(sql , [email]);
        
        if(result.length > 0){
            const passwd = await bcrypt.compare(password , result[0].password); 
            if(passwd){
                console.log('Admin found ..');
                return result[0];
            }
           else{
                console.log("NO admin found ..");
                return null;
            }
        }
        
    }
    catch(e){
        console.log(`Not an admin : ${e.message}`);
        return false;
    }
    
}

async function getUser(role , email , password){
    
    try{
        const sql = "SELECT * FROM users WHERE role = ? AND email = ?";
        const [rows] = await database.pool.execute(sql, [role , email]);
        if(rows.length === 0){
            return null
        }

        const unhashPassword = await bcrypt.compare(password , rows[0].password);
        if(!unhashPassword){
           console.log('User is not in database!!!')
            return null;
        }
        
        console.log('User found in database.')
        return rows[0];
 
    }
    
    catch (e) {
        console.log(`Finding user error : ${e.message}`);
        return null;
    }
}

module.exports = {
    createUser,
    getUser,
    getAdmin
}