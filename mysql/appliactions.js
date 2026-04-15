const database = require('./db');

async function applyForProject(userId , projectId , email , message , skills){

    try{

        const sql = "INSERT INTO applications(user_id , project_id , email , request_message , request_skills) VALUES(?,?,?,?,?)";
        const [result] = await database.pool.execute(sql , [userId , projectId , email , message , skills]);
        if(result.affectedRows <= 0){
            console.log(`Application failed ..`);
            return false;
        }
    
        return result;
    }

    catch(e){
        return e.message;
    }

}

async function myProjectApplications(userId){

    try{
        const sql = "SELECT a.request_id , p.project_title , c.category_name , c.category_name , a.request_date, a.request_message  FROM applications AS a INNER JOIN student_projects AS p INNER JOIN categories AS c ON a.project_id = p.project_id AND p.project_type = category_id  WHERE a.user_id = ?;";
        const [rows] = await database.pool.execute(sql , [userId]);
        if(rows.length <= 0){
            console.log('No applications ..');
            return null
        }

        return rows;
    }
   
    catch(e){
        return e.message;
    }
}

async function deleteApplication(applicationId){


    try{
        const sql = "DELETE FROM applications WHERE request_id = ?";
        const [result] = await database.pool.execute(sql , [applicationId]);

        if(result.affectedRows <= 0){
            console.log(`application deletion failed`);
            return null;
        }

        console.log(`Application deleted ..`);
        return true;
    }

    catch(e){
        return e.message;
    }
}

async function getApplicants(userId){
    
    try{
        const sql = "SELECT a.email , a.request_message , a.request_skills , a.request_date , p.project_title , p.project_type , u.full_name , u.department FROM applications AS a INNER JOIN student_projects AS p INNER JOIN users AS u ON a.project_id = p.project_id AND u.user_id = p.created_by WHERE u.user_id = ?";
        const [rows] = await database.pool.execute(sql , [userId]);
        if(rows === null){
            console.log(`No applicants .`);
            return null;
        }

        return rows;
    }

    catch(e){
        return e.message;
    }
}

async function acceptApplication(studentId){

    try{
        const sql = "INSERT INTO applications(status) VALUES('accepted') WHERE user_id = ?";
        const [result] = await database.pool.execute(sql , [studentId]);
        if(result.affectedRows <= 0){
            console.log(`Status failed ..`);
            return null;
        }

    }

    catch(e){
        return e.message;
    }
}

async function rejectApplication(studentId){

    try{
        const sql = "INSERT INTO applications(status) VALUES('rejected') WHERE user_id = ?";
        const [result] = await database.pool.execute(sql , [studentId]);
        if(result.affectedRows <= 0){
            console.log(`Status failed ..`);
            return null;
        }

    }

    catch(e){
        return e.message;
    }
}



module.exports = {
    applyForProject,
    myProjectApplications,
    deleteApplication,
    getApplicants,
    acceptApplication,
    rejectApplication
}