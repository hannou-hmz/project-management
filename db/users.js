const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltCount = 8;


mongoose.connect('mongodb://127.0.0.1:27017/teamPlatform')
 .then(()=>{console.log('User connected to db..')})
 .catch((dbError) => {console.log(dbError.message)});

 const userSchema = mongoose.Schema({
    role : {
        type: String,
        required : true,
    },

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

 const users = mongoose.model('user' , userSchema);

 async function saveUser(userame , email , department , passwd){

    const hashedPasswd = await bcrypt.hash(passwd , saltCount);
    try{
        const user = await users.insertOne({
                fullName : userame,
                email : email,
                department : department,
                password : hashedPasswd
            });

        console.log('User registered ..');
        return true;
    }
    catch(e){
        console.log(`User db error : ${e.message}`);
    }  
 }

 async function findUser(email , passwd){
    try{
        const user = await users.findOne({email});
        if(user){
            const found = await bcrypt.compare(passwd , user.password);
            if(found){
                console.log(`User found ..`);
                return user;
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
    saveUser,
    findUser
}