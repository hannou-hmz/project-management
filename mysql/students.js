const database = require('./db');

async function getStudentProfileInfo(studentId){
    
    try{
        const sql = "SELECT u.full_name , u.email , d.department_name , s.bio , s.skills  FROM students AS s INNER JOIN users AS u  INNER JOIN departments AS d ON u.user_id = s.student_id AND d.department_id = u.department WHERE student_id = ?";
        const [rows] = await database.pool.execute(sql , [studentId]);
    
        if(rows.length <= 0){
            console.log(`No such user`);
            return null;
        }
    
        return rows[0];
    
    }
    
    catch(e){
        console.log(`get user by id error : `);
        return e.message;
    }
}

async function getMyAdvisorRequests(studentId){

    try{
            const sql = "SELECT a.request_id , sp.project_title, sp.project_description , c.category_name , a.request_message , a.meeting_method , a.status , a.requested_at FROM advisor_requests AS a INNER JOIN student_projects AS sp INNER JOIN categories AS c ON  c.category_id = sp.project_type AND sp.project_id = a.project_id WHERE a.student_id = ?";
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

async function createStudentRow(studentId){

    try{
        const sql = "INSERT INTO students(student_id) values(?)";
        const [result] = await database.pool.execute(sql , [studentId]);

        if(result.affectedRows <= 0){
            console.log(`Inserting student row failed ..`);
            return null;
        }

        return true
    }

    catch(e){
        console.log(`Student row insertion error : ${e.message}`);
    }

}

async function modifyStudenSkills(skills , studentId){

    try{
        const sql = "UPDATE students SET skills = ? WHERE student_id = ?";
        const [result] = await database.pool.execute(sql , [skills , studentId]);
        if(!result.affectedRows){
            console.log('Skills not updated ..');
            return false;
        }
        
        console.log('skills updated..');
        return true;
        
    }

    catch(e){
        console.log(`Counldnt update skills : ${e.message}`);
    }
}

async function modifyStudenBio(bio , studentId){

    try{
        const sql = "UPDATE students SET bio = ? WHERE student_id = ?";
        const [result] = await database.pool.execute(sql , [bio , studentId]);
        if(!result.affectedRows){
            console.log('Bio not updated ..');
            return null;
        }
        
        console.log('Bio updated..');
        return true;
        
    }

    catch(e){
        console.log(`Counldnt update bio : ${e.message}`);
    }
}

async function setStudentProfile(studentId){
    try{
        const sql = "INSERT INTO students(student_id , bio , skills) VALUES(?,?,?)"; 
        const [result] = await database.pool.execute(sql , [studentId]);
        if(result.affectedRows <= 0){
            console.log('Set student profile failed!');
            return null;
        }

        return true;
    }

    catch(e){
        console.log(`Student profile : ${e.message}`);
    }
}

async function getStudentById(studentId){
    try{

        const sql = "SELECT * FROM users WHERE role = 3 AND user_id = ?";
        const [row] = await database.pool.execute(sql , [studentId]);
        if(row.length <= 0){
            console.log("no student found");
            return null
        }

        return row[0];
    }

    catch(e){
        console.log(`NO such student .. ${e.message}`);
    }
}

module.exports = {
    getMyAdvisorRequests,
    getStudentById,
    getStudentById,
    getStudentProfileInfo,
    createStudentRow,
    modifyStudenSkills , 
    modifyStudenBio
}