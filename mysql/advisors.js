const database = require('./db');

async function getAdvisors(){
    try{
        const sql = "select u.user_id , u.full_name , u.email , d.department_name FROM users AS u INNER JOIN departments AS d ON d.department_id = u.department WHERE u.role = 2"
        const [rows] = await database.pool.execute(sql);

        if(!rows || rows.affectedRows <= 0){
            console.log(`Advisors set Null`);
            return null;
        }

        return rows;
    }

    catch(e){
        console.log(`Get advisors error : ${e.message}`);
    }
}

async function requestAdvisor(advisorId, projectId , studentId , message , meetingMethod){

    try{
        const sql = "INSERT INTO advisor_requests (advisor_id , project_id, student_id , request_message , meeting_method) VALUES (?,?,?,?,?)";
        const [result] = await database.pool.execute(sql , [advisorId , projectId, studentId , message , meetingMethod]);
        if(result.affectedRows <= 0){
            console.log(`Insertion failed`);
            return null;
        }

        return true;
    }

    catch(e){
        console.log(`Request advisor error : ${e.message}`);
    }
}

async function advisorDashboard(){

    try{
        const sql = "SELECT u.full_name , a.status , a.requested_at FROM users AS u INNER JOIN advisor_requests AS a ON a.student_id = u.user_id";
        const [rows] = await database.pool.execute(sql);

        if(rows.affectedRows <= 0){
            console.log("Fetching advisor dashboard failed !!");
            return null;
        }

        return rows;
    }

    catch(e){
        console.log(`Advisor infos {advisorDashboard()} : ${e.message}`);
    }

}

async function getRequests(advisorId){
    try{
        const sql = "SELECT a.request_id , u.user_id, u.full_name , u.email , d.department_name , sp.project_title, sp.project_description , c.category_name , a.request_message , a.meeting_method , a.requested_at FROM advisor_requests AS a INNER JOIN student_projects AS sp INNER JOIN users AS u INNER JOIN departments AS d INNER JOIN categories AS c ON u.user_id = a.student_id AND d.department_id = u.department AND c.category_id = sp.project_type AND sp.project_id = a.project_id WHERE a.advisor_id = ?";
        const [rows] = await database.pool.execute(sql , [advisorId]);

        if(rows.length <= 0){
            console.log('No requests !!');
            return null;
        }

        return rows;
    }

    catch(e){
        console.log(`Get all requests error : ${e.message}`);
    }
}

async function countPendingRequests(advisorId){

    try{
        const sql = "SELECT count(status) as pending_requests FROM advisor_requests WHERE status = 'pending' AND advisor_id = ?";
        const [result] = await database.pool.execute(sql , [advisorId]);

        if(result.length <= 0){
            console.log(`No pending requests .`);
            return null;
        }

        return result[0];
    }

    catch(e){
        console.log(`Count pending request error : ${e.message}`);
    }
}

async function getPendingRequests(advisorId){

    try{
        const sql = "SELECT a.request_id , u.user_id, u.full_name , u.email , d.department_name , sp.project_title, sp.project_description , c.category_name , a.request_message , a.meeting_method , a.requested_at FROM advisor_requests AS a INNER JOIN student_projects AS sp INNER JOIN users AS u INNER JOIN departments AS d INNER JOIN categories AS c ON u.user_id = a.student_id AND d.department_id = u.department AND c.category_id = sp.project_type AND sp.project_id = a.project_id WHERE a.status = 'pending' AND a.advisor_id = ?";
        const [rows] = await database.pool.execute(sql , [advisorId]);
        if(rows === null){
            console.log("No requests ..");
            return null;
        }

        return rows;

    }
    catch(e){
       console.log(`Pending request request error : ${e.message}`);
    }
}

async function acceptRequest(requestId){
    try{
        const sql = "UPDATE advisor_requests SET status = 'accepted' WHERE request_id = ?";
        const [result] = await database.pool.execute(sql , [requestId]);

        if(result.affectedRows <= 0){
            console.log("status update failed !!");
            return null;
        }

        return true;
    }

    catch(e){
        console.log(`Accept request error : ${e.message}`);
    }
}

async function rejectRequest(requestId){
    try{
        const sql = "UPDATE advisor_requests SET status = 'rejected' WHERE request_id = ?";
        const [result] = await database.pool.execute(sql , [requestId]);

        if(result.affectedRows <= 0){
            console.log("status update failed !!");
            return null;
        }

        return true;
    }

    catch(e){
        console.log(`Reject request error : ${e.message}`);
    }
}

async function myProjects(advisorId){

    try{
        const sql = "SELECT u.full_name , u.email , p.project_title , p.project_description , p.budget , a.meeting_method  FROM advisor_requests AS a INNER JOIN users AS u INNER JOIN student_projects AS p ON u.user_id = a.advisor_id AND p.project_id = a.project_id WHERE a.status = 'accepted' AND a.advisor_id = ?";
        const [rows] = await database.pool.execute(sql , [advisorId]);
        if(rows.length <= 0){
            console.log("My projects is null");
            return null;
        }

        return rows;
    }

    catch(e){
        console.log(`My projects error :${e.message} `);
    }
}

module.exports = {
    getAdvisors, 
    getRequests,
    acceptRequest,
    rejectRequest,
    myProjects,
    requestAdvisor,
    advisorDashboard,
    countPendingRequests,
    getPendingRequests
}