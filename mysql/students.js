const database = require('./db');

async function getMyAdvisorRequests(studentId){

    try{
            const sql = "SELECT a.request_id , u.user_id, u.full_name , u.email , d.department_name , sp.project_title, sp.project_description , c.category_name , a.request_message , a.meeting_method , a.status , a.requested_at FROM advisor_requests AS a INNER JOIN student_projects AS sp INNER JOIN users AS u INNER JOIN departments AS d INNER JOIN categories AS c ON u.user_id = a.student_id AND d.department_id = u.department AND c.category_id = sp.project_type AND sp.project_id = a.project_id WHERE a.student_id = ?";
            const [rows] = await database.pool.execute(sql , [studentId]);
    
            if(rows.length <= 0){
                console.log('No requests !!');
                return null;
            }
    
            return rows;
        }
    
        catch(e){
            return e.message;
        }
}

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
    getMyAdvisorRequests,
    modifyStudenPhoto , 
    modifyStudenSkills , 
    modifyStudenBio
}