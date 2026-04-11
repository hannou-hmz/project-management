const database = require('./db');

async function modifyStudenPhoto(student_id , profile_photo){

    try{
        const sql = "UPDATE students SET profile_photo = ? WHERE student_id = ?";
        const [result] = await database.pool.execute(sql , [profile_photo , student_id]);
        if(result.affectedRows <= 0){
            console.log('Not updated ..');
            return false;
        }

        console.log('Profile photo updated..');
        return true;
    }

    catch(e){
        console.log(`Counldnt update profile photo : ${e.message}`);
        return null;
    }
}

async function modifyStudenSkills(student_id , skills){

    try{
        const sql = "UPDATE students SET skills = ? WHERE student_id = ?";
        const [result] = await database.pool.execute(sql , [skills , student_id]);
        if(result.affectedRows <= 0){
            console.log('Not updated ..');
            return false;
        }
        
        console.log('skills updated..');
        return true;
        
    }

    catch(e){
        console.log(`Counldnt update skills : ${e.message}`);
        return null;
    }
}

async function modifyStudenBio(student_id , bio){

    try{
        const sql = "UPDATE students SET bio = ? WHERE student_id = ?";
        const [result] = await database.pool.execute(sql , [bio , student_id]);
        if(result.affectedRows <= 0){
            console.log('Not updated ..');
            return false;
        }
        
        console.log('Bio updated..');
        return true;
        
        
    }

    catch(e){
        console.log(`Counldnt update bio : ${e.message}`);
        return null;
    }
}

module.exports = {
    modifyStudenPhoto , 
    modifyStudenSkills , 
    modifyStudenBio
}