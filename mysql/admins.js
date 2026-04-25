const database = require('./db');

async function countAnnouncements(){
    try{
        const sql = "SELECT count(announcement_id) AS announcements FROM announcements";
        const [result] = await database.pool.execute(sql);
    }catch(e){
        throw e;
    }
}

async function countProjects(){
    try{
        const sql = "SELECT count(project_id) AS total_projects FROM student_projects";
        const [result] = await database.pool.execute(sql);
    }catch(e){
        throw e;
    }
}

async function countCategories(){
    try{
        const sql = "SELECT count(category_id) AS total_categories FROM categories";
        const [result] = await database.pool.execute(sql);

    }catch(e){
        throw e;
    }
}

async function countUsers(){
    try{
        const sql = "SELECT COUNT(user_id) AS total_users FROM users";
        const [result] = await database.pool.execute(sql);
    }catch(e){
        throw e;
    }
}