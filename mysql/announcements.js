const database = require('./db');

async function getAnnouncements(){
    const sql = "SELECT * FROM announcements"
    const [result] = await database.pool.execute(sql);
    return result;
}

async function addAnnouncement(category , title , description , isUrgent){
    try{
        const sql = "INSERT INTO announcements (category , title , description , is_urgent) VALUES(? , ? , ? , ?)";
        const [result] = await database.pool.execute(sql , [category , title , description , isUrgent ? 1 : 0]);
        console.log('Announcement stored in db✅');
        return result.affectedRows;
    }
    catch(e){
        console.log(`Announmcment error: ${e.message}`);
        return false;
    }
}


module.exports = {
    addAnnouncement,
    getAnnouncements
}