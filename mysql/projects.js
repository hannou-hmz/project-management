const database = require('./db');

async function createProjects(title , type , description , budget , skills , team_size , require_advisor , created_by){
    try{
        const sql = "INSERT INTO student_projects(project_title , project_type , project_description , budget , required_skills , team_size , require_advisor , created_by) VALUES(?,?,?,?,?,?,?,?)";
        const [result] = await database.pool.execute(sql , [title , type , description , budget , skills , team_size , require_advisor ? 1 : 0 , created_by]);
        
        if(!result.affectedRows){
            console.log("Project creation failed ..");
            return null;
        }

        console.log(`Project successefuly created`);
        return result;
    }
    catch(e){
        console.log(`Project not successefuly created : ${e.message}`);
    } 
}

async function getProjects(){
    try{
        const sql = "SELECT p.project_id , p.project_title , c.category_name , u.full_name , p.project_description ,p.team_size , p.budget , p.required_skills , p.created_at FROM student_projects AS p INNER JOIN categories AS c INNER JOIN users AS u ON c.category_id = p.project_type AND p.created_by = u.user_id";
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

async function deleteProjects(projectId , studentId){

    try{
        const sql = "DELETE FROM student_projects WHERE project_id = ? AND created_by = ?";
        const [result] = await database.pool.execute(sql , [projectId , studentId]);
        if(result.affectedRows <= 0){
            console.log('DELETION failed ..');
            return null;
        }

        console.log("successefully deleted ..");
        return true;
    }

    catch(e){
        return e.message;
    }
}

async function myProjects(createdBy){

    try{
        const sql = "SELECT p.project_id , p.project_title , u.full_name , c.category_name , p.project_description ,p.budget , p.required_skills , p.team_size , p.require_advisor , p.created_at FROM student_projects AS p INNER JOIN users AS u INNER JOIN categories AS c ON p.created_by = user_id AND p.project_type = c.category_id WHERE created_by = ?";
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
        return e;
    };

}

module.exports = {
    createProjects,
    getProjects,
    deleteProjects,
    myProjects
}