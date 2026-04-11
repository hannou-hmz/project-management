const database = require('./db');

async function createAdvisorProfile(id , academicTitle , expertise , researches , availability){

    try{
        const sql = "INSERT INTO advisors (academic_title , areas_of_expertise , research , available) VALUES(?,?,?,?) WHERE advisor_id = ?";
        const [result] = await database.pool.execute(sql , [academicTitle ?? null , expertise ?? null, researches ?? null, availability ? 1 : 0 , id]);
        if(result.affectedRows <= 0){
            console.log(`Nothing is inserted into advisor profile`);
            return null;
        }

        console.log(`Successefully ..`);
        return true;
    }
    catch(e){
        console.log(`Error : ${e.message}`);
        return false;
    }
}

async function updateAdvisorProfile(id, academicTitle , expertise , researches , availability){
    
    try{
        const sql = "UPDATE advisors SET academic_title = ? , areas_of_expertise = ? , researches = ? , availabile = ? WHERE advisor_id = ?";
        const [result] = await database.pool.execute(sql , [academicTitle ?? null , expertise ?? null, researches ?? null, availability ? 1 : 0 , id]);
        if(result.affectedRows <= 0){
            console.log(`Update failed ..`);
            return null;
        }

        console.log(`Updated successefully ..`);
        return true;
    }
    catch(e){
        console.log(`Error : ${e.message}`);
        return false;
    }
}


module.exports = {
    createAdvisorProfile , 
    updateAdvisorProfile
}