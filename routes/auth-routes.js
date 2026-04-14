const express = require('express');
const path = require('path');
const authRoutes = express.Router();
const db = require('../mysql/db');
const {createUser , getUser} = require('../mysql/users');
const {getProjects} = require('../mysql/projects');


authRoutes.get('/' , (req , res , next)=>{
    return res.sendFile(path.join(__dirname ,'../static-files/html-files/homepage.html'));
});

authRoutes.get('/projects' , async (req , res)=>{

    const projects = await getProjects();
    if(!projects){
        return res.status(500).send('Internal issues ..');
    }

    return res.render("show-projects" , {
        projects : projects
    });
});

authRoutes.get('/login' , (req , res)=>{
   return res.sendFile(path.join(__dirname , '../static-files/html-files/login.html'));
});

authRoutes.post('/login' , async (req , res)=>{
    const {role , email , password} = req.body;
    const userRole = Number(role);
    const user = await getUser(userRole , email , password);

    if(user && userRole === 3){
        req.session.studentId = user.user_id;
        return res.redirect('/student/homepage');
    }
    else if(user && userRole === 2){
        req.session.advisorId = user.user_id;
        return res.redirect('/advisor/homepage');
    }
    else{
        console.log('Wrong credentials');
        return res.redirect('/login');
    }
    
});

authRoutes.get('/signup' , async(req , res)=>{
   return res.sendFile(path.join(__dirname , '../static-files/html-files/signup.html'));
});

authRoutes.post('/signup' , async (req , res)=>{
    const {role , username , age , email , department , password , confirm_password} = req.body;
    if(password != confirm_password){
        console.log('Inorrect password');
        return res.redirect('/signup');
    }

    const user = await createUser(role , username , age ,email , department , password);
    if(user && role === '3'){
        req.session.studentId = user.user_id;
        return res.status(200).redirect('/student/homepage');
    }
    else if(user && role === '2'){
        req.session.advisorId = user.user_id;
        return res.status(200).redirect('/advisor/homepage');
    }
    else{
        return res.status(422).send("Validation failed!");
    }     
});

authRoutes.get('/logout' , (req , res) =>{
    req.session.destroy((error)=>{
        if(error){
            console.log(error.message);
            return res.status(500).send(`<h1>Logout failed!</h1>`);
        }

        res.clearCookie('connect.sid');
        return res.redirect('/login');
    });
})



module.exports = authRoutes;