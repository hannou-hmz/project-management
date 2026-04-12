const database = require('./db');

async function getCategories(){

    try{
        const sql = "SELECT category_id, category_name , category_description , created_at FROM categories";
        const [result] = await database.pool.execute(sql);
        if(result.length <= 0){
            console.log('No categorires ..');
            return null;
        }

        return result;
    }

    catch(e){
        console.log(e.message);
        return false;
    }
}

async function deleteCategory(id){

    try{
        const sql = "DELETE FROM categories WHERE category_id = ?";
        const [result] = await database.pool.execute(sql , [id]);
        if(result.affectedRows <= 0){
            console.log(`Deletion failed ..`);
            return false;
        }
        
        console.log('Deletion successefully..');
        return true;
    }

    catch(e){
        return e.message
    }
}

async function addCategory(name, description){

    try{
        const sql = "INSERT INTO categories (category_name , category_description) VALUES(?,?)";
        const[result] = await database.pool.execute(sql , [name , description]);
        if(result.affectedRows <= 0){
            console.log('Insertion failed ..');
            return null;
        }

        console.log(`Inserted successefully ..`);
        return true;
    }

    catch(e){
        console.log(e.message);
        return false;
    }
}

module.exports = {
    getCategories,
    addCategory,
    deleteCategory
}