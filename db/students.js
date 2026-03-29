const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltCount = 8;


mongoose.connect('mongodb://127.0.0.1:27017/teamPlatform')
 .then(()=>{console.log('St connected to db..')})
 .catch((dbError) => {console.log(dbError.message)});

 const studentSchema = mongoose.Schema({
    fullName : {
        type: String,
        required : true,
    },

    email : {
        type: String,
        required : true,
        unique : true
    },

    department : {
        type: String,
        required : true,
    },

    password : {
        type: String,
        required : true,
    }
 });

 const students = mongoose.model('student' , studentSchema);

 async function saveStudent(stName , email , department , passwd){

    const hashedPasswd = await bcrypt.hash(passwd , saltCount);
    try{
        const st = await students.insertOne({
                fullName : stName,
                email : email,
                department : department,
                password : hashedPasswd
            });

        console.log('Student registered ..');
        return true;
    }
    catch(e){
        console.log(`St db error : ${e.message}`);
    }  
 }

 async function findStudent(email , passwd){
    try{
        const student = await students.findOne({email});
        if(student){
            const found = await bcrypt.compare(passwd , student.password);
            if(found){
                console.log(`Student found ..`);
                return student;
            }
            else{
                return false;
            }
        }  
    }

    catch(findError){
        console.log(findError.message);
        return false;
    }
 }


 
module.exports = {
    saveStudent,
    findStudent
}