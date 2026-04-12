const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const db = require('../mysql/db');
const {createUser , getAdmin , getUser} = require('../mysql/users');
const {createAdvisorProfile , updateAdvisorProfile} = require('../mysql/advisors');
const {modifyStudenPhoto , modifyStudenSkills , modifyStudenBio} = require('../mysql/students');
const {getCategories ,addCategory, deleteCategory} = require('../mysql/categories');
const {addAnnouncement , getAnnouncements} = require('../mysql/announcements');
const {createProjects , getProjects , myProjects} = require('../mysql/projects');


function isAdmin(req, res, next){
    if(!req.session.adminId){
        console.log('No admin session .. redirecting ..');
        return res.redirect('/admin/dashboard');
    }
    next();
}

function isAdvisor(req, res, next){
    if(!req.session.advisorId){
        console.log('No advisor session .. redirecting ..');
        return res.redirect('/login');
    }
    next();
}

router.get('/admin/dashboard' , (req , res)=>{
    return res.sendFile(path.join(__dirname , '../static-files/html-files/admin-login.html'));
});

router.post('/admin/dashboard' , async(req , res)=>{
    const {email , password} = req.body;
    const admin = await getAdmin(email , password);
    if(admin){
        req.session.adminId = admin.admin_id;
        console.log(`Admin ✅`);
        return res.redirect('/admin/homepage');
    }
    
    console.log(`Not admin ❌`);
    return res.status(404).send(`<h1>Not found</h1>`);
})

router.get('/admin/homepage' , isAdmin ,(req , res)=>{
    return res.sendFile(path.join(__dirname , "../static-files/html-files/admin-homepage.html"));
});

router.get('/admin/projects' , isAdmin ,async (req , res)=>{
    const project = await getProjects();
    if(!project){
        return res.status(500).send('Internal issues ..');
    }

    return res.status(200).json(project);
});

router.get('/admin/announcements' , isAdmin , async(req , res)=>{

    const announcements = await getAnnouncements();
    return res.send(announcements);
});
    
router.get('/categories' , isAdmin ,async(req , res)=>{

    const categories = await getCategories();
    const projects = categories.map(cat => ({
        id: cat.category_id,
        name: cat.category_name,
        description: cat.category_description
    }));

    return res.render('admin-categories' , {projects});

});

router.post('/categories' , isAdmin , async(req , res)=>{

    const {categoryName , description} = req.body;
    const createCategory = await addCategory(categoryName , description);

    if(!createCategory){
        console.log('Category failed..');
       return res.send('Internal issues'); 
    }

    return res.redirect('/admin/homepage');

});

router.post('/categories/delete/api' , async(req , res)=>{

    const {projectId} = req.body;
    console.log('ID : ',projectId);
    const removeCategory = await deleteCategory(projectId);

    if(!removeCategory){
        return res.send('Internal issues..');
    }

    return res.redirect('/admin/homepage');
});

router.get('/' , (req , res , next)=>{
    return res.sendFile(path.join(__dirname ,'../static-files/html-files/homepage.html'));
});

router.get('/advisor/homepage' , isAdvisor, (req , res)=>{

    return res.sendFile(path.join(__dirname ,'../static-files/html-files/advisor-home.html'));
});




module.exports = router;