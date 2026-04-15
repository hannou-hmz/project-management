const express = require('express');
const path = require('path');
const studentRoutes = express.Router();
const db = require('../mysql/db');
const {modifyStudenPhoto , modifyStudenSkills , modifyStudenBio} = require('../mysql/students');
const {getCategories ,addCategory, deleteCategory} = require('../mysql/categories');
const {getAdvisors , requestAdvisor} = require('../mysql/advisors');
const {getAnnouncements} = require('../mysql/announcements');
const {createProjects , getProjects , deleteProjects, myProjects} = require('../mysql/projects');
const {applyForProject, myProjectApplications, deleteApplication, getApplicants , acceptApplication , rejectApplication} = require('../mysql/appliactions');

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
    console.log(announcements);
    return res.render("announcements" , {
        announcements : announcements
    });
});

studentRoutes.get('/create/projects' , isStudent ,(req , res)=>{

    return res.sendFile(path.join(__dirname , '../static-files/html-files/project.html'));
});

studentRoutes.post('/create/projects' , async (req , res)=>{

    const {title , category , description , budget , skills , teamSize , reqAdvisor } = req.body;
    const createdBy = req.session.studentId;
    const announcementCategory = Number(category);

    try{
        const project = await createProjects(title , announcementCategory , description , budget , skills , teamSize , reqAdvisor , createdBy);
        console.log(project);
        return res.redirect('/student/homepage');    
    } 
    catch(e){
        res.status(500).send(`Inernal error ...`);
    }
})

studentRoutes.get('/projects' , isStudent , async (req , res)=>{

    const projects = await getProjects();
    if(!projects){
        return res.status(500).send('Internal issues ..');
    }

    return res.render("show-projects" , {
        projects : projects
    });

});

studentRoutes.get('/myprojects' , isStudent , async(req , res)=>{

    const createdBy = req.session.studentId;
    const myproject = await myProjects(createdBy);

    if(!myProjects){
        return res.status(500).send(`Internal issues ...`);
    }

    return res.render("my-projects" , {
        projects : myproject 
    });
});

studentRoutes.get('/:id/delete' ,async (req ,res)=>{

    const projectId = req.params.id;
    const deleteProject = await deleteProjects(projectId);
    if(deleteProject === null){
        return res.status(500).send('Internal issues ..');
    }

    return res.redirect('/student/myprojects');
});

studentRoutes.get('/project/application/:id/apply' , isStudent , async(req , res)=>{
    
    const projectId = req.params.id;

    return res.render("submit-application" , {
         projectId: projectId
    });
});

studentRoutes.post('/project/application/submit'  , async(req , res)=>{

    const id = req.session.studentId;
    const {projectId , email , message , skills}  = req.body;

    const application = await applyForProject(id , projectId , email , message , skills);
    if(!application){
        return res.send("internal issues");
    }
    return res.redirect('/student/projects');

});

studentRoutes.get('/applications' , isStudent , async(req , res)=>{

    const id = req.session.studentId;
    const applications = await myProjectApplications(id);

    return res.render("myapplications" , {
        applications : applications
    });
});

studentRoutes.get('/applications/:applicationID/delete' , async(req , res)=>{
    
    const applicationId = req.params.applicationID;
    const removeApplication = await deleteApplication(applicationId);
    if(removeApplication === null){
        return res.status(500).send("internal issues ..");
    }

    return res.render("myapplications" , {
        applications : removeApplication
    });
});

studentRoutes.get('/applicants' ,async (req , res)=>{

    const id = req.session.studentId;
    const applicants = await getApplicants(id);
    
    return res.render("applicants" , {
        applicants : applicants
    });
});

studentRoutes.get('/find/advisors' , isStudent , async(req ,  res)=>{
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

studentRoutes.get('/requests/:advisorId/advisors' , isStudent , async(req , res)=>{
    try{

        const advisorId = Number(req.params.advisorId);
        const categories = await getCategories();
        return res.render("request-advisor" , {
            advisorId : advisorId , 
            categories : categories
        });
    }
    catch(e){
        console.log(e.message);
        return res.status(500).render("500");
    }
})

studentRoutes.post('/requests/:advisorId/advisors' , isStudent , async(req ,res)=>{

    try{
        const advisorId = Number(req.params.advisorId);
        const studentId = req.session.studentId;
        const {projectName , projectDescription , categoryId, message , meetingMethod} = req.body;
        const request = await requestAdvisor(advisorId, studentId , projectName , projectDescription , categoryId , message , meetingMethod);

        if(!request){
            console.log("Request failed ..");
            return res.status(500).send("request failed");
        }

        console.log(request);
        return res.redirect('/student/find/advisors');
    }

    catch(e){
        return e.message;
    }
});





module.exports = studentRoutes;