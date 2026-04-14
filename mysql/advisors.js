const database = require('./db');

async function getAdvisors(){
    try{
        const sql = "select u.user_id , u.full_name , u.email , d.department_name FROM users AS u INNER JOIN departments AS d ON d.department_id = u.department WHERE u.role = 2"
        const [rows] = await database.pool.execute(sql);

        if(!rows || rows.affectedRows <= 0){
            console.log(`Advisors set Null`);
            return null;
        }

        return rows;
    }

    catch(e){
        return e.message;
    }
}

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

async function requestAdvisor(advisorId , studentId , message , meetingMethod){

    try{
        const sql = "INSERT INTO advisor_requests (advisor_id , student_id , request_message , meeting_method) VALUES (?,?,?,?)";
        const [result] = await database.pool.execute(sql , [advisorId , studentId , message , meetingMethod]);
        if(result.affectedRows <= 0){
            console.log(`Insertion failed`);
            return null;
        }

        return true;
    }

    catch(e){
        return e.message;
    }
}


module.exports = {
    createAdvisorProfile ,
    getAdvisors, 
    updateAdvisorProfile,
    requestAdvisor
}