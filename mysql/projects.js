const database = require('./db');

async function createProjects(title , type , description , budget , skills , team_size , require_advisor , created_by){
    try{
        const sql = "INSERT INTO projects(project_title , project_type , project_description , budget , required_skills , team_size , require_advisor , created_by) VALUES(?,?,?,?,?,?,?,?)";
        const [result] = await database.pool.execute(sql , [title , type , description , budget , skills , team_size , require_advisor ? 1 : 0 , created_by]);
        console.log(`Project successefuly created`);
        return result;
    }
    catch(e){
        console.log(`Project not successefuly created : ${e.message}`);
        return false;
    } 
}

async function getProjects(){
    try{
        const sql = "SELECT p.project_id , p.project_title , c.category_name , p.project_description , p.budget , p.required_skills , p.created_at FROM projects AS p INNER JOIN categories AS c ON c.category_id = p.project_type;";
        const [rows] = await database.pool.execute(sql);
        if(rows.affectedRows <= 0){
            console.log("No projects here ..");
            return null
        }

        return rows;
    }
    catch(e){
        console.log(`Fetching projects : ${e.message}`);
        return false;
    }
    
}

async function myProjects(createdBy){

    try{
        const sql = "SELECT * FROM projects WHERE created_by = ?";
        const [result] = await database.pool.execute(sql , [createdBy]);

        if(result.length > 0){
            console.log(`Serving my projects ..`);
            return result;
        }
        else{
            console.log('Nothing to serve.');
            return null;
        }
    }
    catch(e){
        console.log(`My projects error :${e.message}`);
        return false;
    };

}

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
        const sql = "SELECT pa.request_id p.project_title , p.project_type , c.category_name , pa .request_date, pa.request_message  FROM project_applications AS pa INNER JOIN projects AS p INNER JOIN categories AS c ON pa.project_id = p.project_id AND p.project_type = category_id  WHERE user pa.user_id = ?;";
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


module.exports = {
    createProjects,
    getProjects,
    myProjects,
    applyForProject,
    myProjectApplications
}