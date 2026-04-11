const database = require('./db');

async function getCategories(){

    try{
        const sql = "SELECT category_name , category_description FROM categories";
        const [result] = await database.pool.execute(sql);
        if(result.length <= 0){
            console.log('No categorires ..');
            return null;
        }

        console.log();
        return result;
    }

    catch(e){
        console.log(e.message);
        return false;
    }
}

module.exports = {
    getCategories
}