const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const authRoutes = express.Router();
const db = require('../mysql/db');
const {getAdvisors , createAdvisorRow} = require('../mysql/advisors');
const {createUser , getUser , resetPassword} = require('../mysql/users');
const {createStudentRow} = require('../mysql/students');
const {getProjects} = require('../mysql/projects');
const { getCategories } = require('../mysql/categories');

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  message : "Too many attempts"
});

function isStudent(req, res, next){
    if(!req.session.studentId){
        console.log('No student session .. redirecting ..');
        return res.redirect('/login');
    }
    next();
}

authRoutes.get('/' , async(req , res , next)=>{
    try{
        const projects = await getProjects();
        const categories = await getCategories();
        console.log(projects)
        
        return res.render("homepage" , {
            projects : projects,
        });
    }

    catch(e){
        console.log(e.message);
        return res.status(500).render("500")
    }
    
});

authRoutes.get('/projects' , isStudent , async (req , res)=>{

    const projects = await getProjects();
    const categories = await getCategories();
    if(!projects){
        return res.status(500).send('Internal issues ..');
    }

    return res.render("show-projects" , {
        projects : projects,
        categories : categories
    });
});

authRoutes.get('/find/advisor' , isStudent ,  async(req , res)=>{

    try{
        const advisors = await getAdvisors();
        return res.render("find-advisors" , {
            advisors : advisors
        });
    }

    catch(e){
        console.log(`Error : ${e.message}`);
    }
});

authRoutes.get('/login' ,(req , res)=>{
    try{
        return res.render("login" , {
        title : "ProjectHub Login",
        error : "Invalid passowrd or email"
        });
    }catch(e){
        console.log(e.message);
        return res.status(500).render("500");
    }
});

authRoutes.post('/login' , loginLimiter , async (req , res)=>{
    try{
        const {role , email , password} = req.body;
        const userRole = Number(role);
        const user = await getUser(userRole , email , password);
        
        if(!email || typeof email !== 'string'){
            return res.status(400).send("Invalid input");
        }

        else{
            if(user && userRole === 3){
                req.session.studentId = user.user_id;
                return res.redirect('/student/homepage');
            }
            else if(user && userRole === 2){
                req.session.advisorId = user.user_id;
                return res.redirect('/advisor/dashboard');
            }
            else{
                console.log('Wrong credentials');
                return res.redirect('/login');
            }
        }

    }catch(e){  
        console.log(e.message);
        return res.status(500).render("500");
    }
 
});

authRoutes.get('/forget-password' , async(req , res)=> {
    try{
        const {password , email} = req.body;
        if(!email || typeof email !== 'string' || !password || typeof password !== 'string'){

            console.log('Suspicious attempt to reset password .');

            return res.status(400).render("400" , {
                error: "Invalid request",
                message: "Missing required field: email"
            });
        }

        const reset = await resetPassword(password , email);
        
        return res.status(302).redirect('/login'); // 302 => found : temp redirect 
    }catch(e){

    }
});

authRoutes.get('/signup' , async(req , res)=>{
    try{
        return res.render("signup" , {
        title : "Create Account"
        });
    }catch(e){
        console.log(e.message);
        return res.status(500).render("500");
    }
});

authRoutes.post('/signup' , async (req , res)=>{
    try{
        const {role , username , age , email , department , password , confirm_password} = req.body;

        if(password != confirm_password){
            console.log('Inorrect password');
            return res.redirect('/signup');
        }

        const user = await createUser(role , username , age ,email , department , password);
        if(user && role === '3'){
            req.session.studentId = user.insertId;
            const studentId = user.insertId;
            await createStudentRow(studentId);
            return res.redirect('/student/homepage');
        }
        else if(user && role === '2'){
            req.session.advisorId = user.insertId;
            const advisorId = user.insertId;
            await createAdvisorRow(advisorId) 
            return res.redirect('/advisor/dashboard');
        }
        else{
            return res.status(422).send("Validation failed!");
        } 
    }catch(e){
        console.log(e.message);
        return res.status(500).render("500");
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