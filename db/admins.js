const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltCount = 8;


mongoose.connect('mongodb://127.0.0.1:27017/teamPlatform')
 .then(()=>{console.log('St connected to db..')})
 .catch((dbError) => {console.log(dbError.message)});

 const studentSchema = mongoose.Schema({
    email : {
        type: String,
        required : true,
        unique : true
    },

    password : {
        type: String,
        required : true,
    }
 });

 const students = mongoose.model('student' , studentSchema);

 async function saveAdmin(email , passwd){

    const hashedPasswd = await bcrypt.hash(passwd , saltCount);
    try{
        const st = await students.insertOne({
                email : email,
                password : hashedPasswd
            });

        console.log('Admin registered ..');
        return true;
    }
    catch(e){
        console.log(`St db error : ${e.message}`);
    }
    
 }

module.exports = {
    saveAdmin
}