const database = require('./db');

async function applyForProject(userId , projectId , email , message , skills){

    try{

        const sql = "INSERT INTO project_applications(user_id , project_id , email , request_message , request_skills) VALUES(?,?,?,?,?)";
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
        const sql = "SELECT pa.request_id , p.project_title , c.category_name , c.category_name , pa .request_date, pa.request_message  FROM project_applications AS pa INNER JOIN projects AS p INNER JOIN categories AS c ON pa.project_id = p.project_id AND p.project_type = category_id  WHERE pa.user_id = ?;";
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
        const sql = "DELETE FROM project_applications WHERE request_id = ?";
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
        const sql = "SELECT pa.email , pa.request_message , pa.request_skills , pa.request_date , p.project_title , p.project_type , u.full_name , u.department FROM project_applications AS pa INNER JOIN projects AS p INNER JOIN users AS u ON pa.project_id = p.project_id AND u.user_id = p.created_by WHERE u.user_id = ?";
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

module.exports = {
    applyForProject,
    myProjectApplications,
    deleteApplication,
    getApplicants
}