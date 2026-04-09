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
        const sql = "SELECT * FROM projects";
        const [rows] = await database.pool.execute(sql);
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


module.exports = {
    createProjects,
    getProjects,
    myProjects
}