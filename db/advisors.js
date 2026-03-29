const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltCount = 8;


mongoose.connect('mongodb://127.0.0.1:27017/teamPlatform')
 .then(()=>{console.log('Advisor connected to db..')})
 .catch((dbError) => {console.log(dbError.message)});

 const advisorSchema = mongoose.Schema({
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

 const advisors = mongoose.model('advisor' , advisorSchema);

 async function saveAdvisor(stName , email , department , passwd){

    const hashedPasswd = await bcrypt.hash(passwd , saltCount);
    try{
        const st = await students.insertOne({
                fullName : stName,
                email : email,
                department : department,
                password : hashedPasswd
            });

        console.log('Advisor registered ..');
        return true;
    }
    catch(e){
        console.log(`Admin db error : ${e.message}`);
    }
    
 }

async function findAdvisor(email , passwd){
    try{
        const advisor = await advisors.findOne({email});
        if(advisor){
            const found = await bcrypt.compare(passwd , advisor.password);
            if(found){
                console.log(`Advisor found ..`);
                return advisor;
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
    saveAdvisor,
    findAdvisor
}