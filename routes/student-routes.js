const express = require('express');
const path = require('path');
const studentRoutes = express.Router();
const db = require('../mysql/db');
const {createUser , getAdmin , getUser} = require('../mysql/users');
const {modifyStudenPhoto , modifyStudenSkills , modifyStudenBio} = require('../mysql/students');
const {getCategories ,addCategory, deleteCategory} = require('../mysql/categories');
const {addAnnouncement , getAnnouncements} = require('../mysql/announcements');
const {createProjects , getProjects , myProjects} = require('../mysql/projects');


function isStudent(req, res, next){
    if(!req.session.studentId){
        console.log('No student session .. redirecting ..');
        return res.redirect('/login');
    }
    next();
}

studentRoutes.get('/homepage' , isStudent , (req , res)=>{
    return res.sendFile(path.join(__dirname ,'../static-files/html-files/student-home.html'));
});

studentRoutes.get('/announcements' , isStudent , async(req , res)=>{

    const announcements = await getAnnouncements();
    return res.send(announcements);
});

studentRoutes.get('/announcements/api' , isStudent ,async (req , res)=>{
    return res.sendFile(path.join(__dirname , '../static-files/html-files/announcement.html'));
});

studentRoutes.post('/announcements/api' , async (req , res)=>{
    const {category , title , description , isUrgent} = req.body;
    const announcementCategory = Number(category);
    const announcement = await addAnnouncement(announcementCategory , title , description , isUrgent);
    if(!announcement){
        return res.status(500).send(`Internal problems ..`);
    }

    return res.redirect('/student/homepage');
});

studentRoutes.get('/create/projects' , isStudent ,(req , res)=>{

    return res.sendFile(path.join(__dirname , '../static-files/html-files/project.html'));
});

studentRoutes.post('create/projects' , async (req , res)=>{

    const {title , category , description , budget , skills , teamSize , reqAdvisor } = req.body;
    const createdBy = req.session.studentId;

    try{
        const project = await createProjects(title , category , description , budget , skills , teamSize , reqAdvisor , createdBy);
        console.log(project);
        return res.redirect('/student/homepage');    
    } 
    catch(e){
        res.status(500).send(`Inernal error ...`);
    }
})

studentRoutes.get('/projects' , isStudent , async (req , res)=>{

    const project = await getProjects();
    if(!project){
        return res.status(500).send('Internal issues ..');
    }

    return res.status(200).json(project);
});

studentRoutes.get('/myprojects' , isStudent , async(req , res)=>{

    const createdBy = req.session.studentId;
    const myproject = await myProjects(createdBy);

    if(!myProjects){
        return res.status(500).send(`Internal issues ...`);
    }

    return res.send(myproject);
});

module.exports = studentRoutes;