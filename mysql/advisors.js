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

async function requestAdvisor(advisorId , studentId , projectName , description , category, message , meetingMethod){

    try{
        const sql = "INSERT INTO advisor_requests (advisor_id , student_id , project_name , project_description , project_type , request_message , meeting_method) VALUES (?,?,?,?,?,?,?)";
        const [result] = await database.pool.execute(sql , [advisorId , studentId , projectName , description , category , message , meetingMethod ]);
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

async function advisorDashboard(){

    try{
        const sql = "SELECT u.full_name , a.status , a.requested_at FROM users AS u INNER JOIN advisor_requests AS a ON a.student_id = u.user_id";
        const [rows] = await database.pool.execute(sql);

        if(rows.affectedRows <= 0){
            console.log("Fetching advisor dashboard failed !!");
            return null;
        }

        return rows;
    }

    catch(e){
        console.log(`Error : `);
        return e.message;
    }

}

async function getRequests(advisorId){
    try{
        const sql = " SELECT u.user_id, u.full_name , u.email , d.department_name , a.project_name, a.project_description , c.category_name , a.request_message , a.meeting_method , a.requested_at FROM advisor_requests AS a INNER JOIN users AS u INNER JOIN departments AS d INNER JOIN categories AS c ON u.user_id = a.student_id AND d.department_id = u.department AND c.category_id = a.project_type WHERE a.advisor_id = ?";
        const [rows] = await database.pool.execute(sql , [advisorId]);

        if(rows.length <= 0){
            console.log('No requests !!');
            return null;
        }

        return rows;
    }

    catch(e){
        return e.message;
    }
}

async function getPendingRequests(){

    try{
        const sql = "SELECT count(*) as pending_requests FROM advisor_requests WHERE status = 'pending' ";
        const [result] = await database.pool.execute(sql);

        if(result.length <= 0){
            console.log(`No pending requests .`);
            return null;
        }

        return result[0];
    }

    catch(e){
        console.log(`Error`);
        return e.message;
    }
}

module.exports = {
    createAdvisorProfile ,
    getAdvisors, 
    getRequests,
    updateAdvisorProfile,
    requestAdvisor,
    advisorDashboard,
    getPendingRequests
}