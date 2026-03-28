const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const {saveStudent} = require('../db/students');
const filePath = 'C:\\Users\\USER\\Desktop\\project-management\\public';

router.get('/admin/dashboard' , (req , res)=>{
       return res.sendFile(path.join(filePath , 'admin.html'));
});

router.get('/' , (req , res)=>{
    return res.send('<h1>Welcome Student/Advisor</h1>');
});

router.get('/student/login' , (req , res)=>{
   return res.sendFile(path.join(filePath , 'student-login.html'));
});

router.post('/student/login' , (req , res)=>{
    const {email , password} = req.body;
    console.log(email);
    return res.json('Welcome '+email);
});

router.get('/student/signup' , (req , res)=>{
   return res.sendFile(path.join(filePath , 'student-signup.html'));
});

router.post('/student/signup' , async (req , res)=>{
    const {username , email , department , password} = req.body;
    const register = await saveStudent(username , email , department , password);
    if(register){
        return res.status(200).redirect('/');
    }

    else{
        return res.status(422).send("Validation failed!");
    }
    
});

router.get('/advisor/login' , (req , res)=>{
    return res.sendFile(path.join(filePath , 'advisor-login.html'));
});

router.post('/advisor/signup' , (req ,res)=>{
    const {advisorName} = req.body;
    return res.json(`Welcome advisor ${advisorName}`);
});

router.post('/advisor/signup' , (req , res)=>{
    const {username} = req.body;
    return res.json(`Welcome advisor ${username}`);
});

router.get('/advisor/signup' , (req , res)=>{
    return res.sendFile(path.join(filePath , 'advisor-signup.html'));
});

module.exports = router;