const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const {saveStudent , findStudent} = require('../db/students');
const {saveAdvisor ,findAdvisor} = require('../db/advisors');
const {saveAdmin , findAdmin} = require('../db/admins');
const filePath = 'C:\\Users\\USER\\Desktop\\project-management\\public';

router.get('/admin/dashboard' , (req , res)=>{
    return res.sendFile(path.join(filePath , 'admin.html'));
});

router.post('/admin/dashboard' , async(req , res)=>{
    const {email , password} = req.body;
    const admin = await findAdmin(email , password);
    if(admin){
        return res.send(`<h1>Admin panel</h1>`);
    }

    return res.status(404).send(`<h1>Not found</h1>`);
})

router.get('/' , (req , res)=>{
    return res.send('<h1>Welcome Student/Advisor</h1>');
});

router.get('/student/login' , (req , res)=>{
   return res.sendFile(path.join(filePath , 'student-login.html'));
});

router.post('/student/login' , async (req , res)=>{
    const {email , password} = req.body;
    const student = await findStudent(email , password);
    if(student){
        return res.status(200).redirect('/');
    }

    return res.status(404).send("<h3>User not found</h3>");
});

router.get('/student/signup' , (req , res)=>{
   return res.sendFile(path.join(filePath , 'student-signup.html'));
});

router.post('/student/signup' , async (req , res)=>{
    const {username , email , department , password} = req.body;
    const student = await saveStudent(username , email , department , password);
    if(!student){
        return res.status(422).send("Validation failed!");
    }

    return res.status(200).redirect('/');    
    
});

router.get('/advisor/login' , (req , res)=>{
    return res.sendFile(path.join(filePath , 'advisor-login.html'));
});

router.post('/advisor/signup' ,async (req ,res)=>{
    const {advisorName , email , department , password} = req.body;
    const advisor = await saveAdvisor(advisorName , email , department , password);
    if(!advisor){
        return res.status(422).send("Validation failed!");
    }
    
     return res.status(200).redirect('/');    
});

router.post('/advisor/signup' , (req , res)=>{
    const {username} = req.body;
    return res.json(`Welcome advisor ${username}`);
});

router.get('/advisor/signup' , (req , res)=>{
    return res.sendFile(path.join(filePath , 'advisor-signup.html'));
});

module.exports = router;