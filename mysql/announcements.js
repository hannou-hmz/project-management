const database = require('./db');

async function getAnnouncements(){
    const sql = "SELECT c.category_id ,c.category_name , a.announcement_id , a.title , a.description , a.created_at , a.is_urgent FROM announcements AS a INNER JOIN categories AS c ON a.category = c.category_id"
    const [result] = await database.pool.execute(sql);
    return result;
}

async function addAnnouncement(category , title , description , isUrgent){
    try{
        const sql = "INSERT INTO announcements (category , title , description , is_urgent) VALUES(? , ? , ? , ?)";
        const [result] = await database.pool.execute(sql , [category , title , description , isUrgent ? 1 : 0]);
        console.log('Announcement stored in db✅');
        if(result.affectedRows <= 0){
            console.log("Insertion of announcement failed ..");
            return null;
        }

        return true;
    }
    catch(e){
        console.log(`Announmcment error: ${e.message}`);
        return false;
    }
}

async function deleteAnnouncement(id){

    try{
        const sql = "DELETE FROM announcements WHERE announcement_id = ?";
        const [result] = await database.pool.execute(sql , [id]);
        
        if(result.affectedRows <= 0){
            console.log('Deletion failed ..');
            return false;
        }

        console.log('Successefully deleted..');
        return true;
    }

    catch(e){
        return e.message;
    }
}

module.exports = {
    addAnnouncement,
    getAnnouncements,
    deleteAnnouncement
}