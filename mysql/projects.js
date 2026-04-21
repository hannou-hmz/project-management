const database = require('./db');

async function createProjects(title , type , description , budget , skills , team_size , require_advisor , created_by){
    try{
        const sql = "INSERT INTO student_projects(project_title , project_type , project_description , budget , required_skills , team_size , require_advisor , created_by) VALUES(?,?,?,?,?,?,?,?)";
        const [result] = await database.pool.execute(sql , [title , type , description , budget , skills , team_size , require_advisor ? 1 : 0 , created_by]);

        console.log(`Project successefuly created`);
        return result;
    }
    catch(e){
        console.log(`Project not successefuly created : ${e.message}`);
        throw e;
    } 
}

async function getProjects(){
    try{
        const sql = "SELECT p.project_id , p.project_title , c.category_name , u.full_name , p.project_description ,p.team_size , p.budget , p.required_skills , p.created_at FROM student_projects AS p INNER JOIN categories AS c INNER JOIN users AS u ON c.category_id = p.project_type AND p.created_by = u.user_id";
        const [rows] = await database.pool.execute(sql);

        return rows;
    }
    catch(e){
        console.log(`Fetching projects : ${e.message}`);
        throw e;
    }
    
}

async function deleteProjects(projectId , studentId){

    try{
        const sql = "DELETE FROM student_projects WHERE project_id = ? AND created_by = ?";
        const [result] = await database.pool.execute(sql , [projectId , studentId]);
        console.log("successefully deleted ..");
    }catch(e){
        console.error("Delete projects error:", e.message);
        throw e; 
    }
}

async function myProjects(createdBy){

    try{
        const sql = "SELECT p.project_id , p.project_title , u.full_name , c.category_name , p.project_description ,p.budget , p.required_skills , p.team_size , p.require_advisor , p.created_at FROM student_projects AS p INNER JOIN users AS u INNER JOIN categories AS c ON p.created_by = u.user_id AND p.project_type = c.category_id WHERE p.created_by = ?";
        const [result] = await database.pool.execute(sql , [createdBy]);

        console.log("Serving my projects...");
        return result; 
    }
    catch(e){
        console.error("My projects error:", e.message);
        throw e; 
    };

}

async function applyForProjects(studentId){
    try{
        const sql = "SELECT * FROM student_projects WHERE created_by != ?";
        const [rows] = await database.pool.execute(sql , [studentId]);
        return rows; 
    }catch(e){
        throw e;
    }
}

module.exports = {
    createProjects,
    getProjects,
    deleteProjects,
    myProjects,
    applyForProjects
}