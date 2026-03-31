const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltCount = 8;


mongoose.connect('mongodb://127.0.0.1:27017/teamPlatform')
 .then(()=>{console.log('Admin connected to db..')})
 .catch((dbError) => {console.log(dbError.message)});

 const adminSchema = mongoose.Schema({
    role : {
        type: String,
        required : true,
    },

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

 const admins = mongoose.model('admin' , adminSchema);

 async function saveAdmin(role , email , passwd){

    const hashedPasswd = await bcrypt.hash(passwd , saltCount);
    try{
        const admin = await admins.insertOne({
            role : role,
            email : email,
            password : hashedPasswd
        });

        console.log('Admin registered ..');
        return true;
    }
    catch(e){
        console.log(`Admin db error : ${e.message}`);
    }
    
 }

 async function findAdmin(role , email , password){
     try{
        const admin = await admins.findOne({role , email , password});
        if(admin){
            console.log(`admin found ..`);
            return admin;
         }         
        else{
            return false;
        }
    }  
 
     catch(findError){
         console.log(findError.message);
         return false;
     }
  }

module.exports = {
    saveAdmin,
    findAdmin
}