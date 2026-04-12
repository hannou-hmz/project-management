const express = require('express');
const path = require('path');
const app = express();
const adminRouters = express.Router();
const db = require('../mysql/db');
const {createUser , getAdmin , getUser} = require('../mysql/users');
const {getCategories ,addCategory, deleteCategory} = require('../mysql/categories');
const {addAnnouncement , getAnnouncements , deleteAnnouncement} = require('../mysql/announcements');
const {createProjects , getProjects , myProjects , deleteProjects} = require('../mysql/projects');


function isAdmin(req, res, next){
    if(!req.session.adminId){
        console.log('No admin session .. redirecting ..');
        return res.redirect('/admin/dashboard');
    }
    next();
}


adminRouters.get('/dashboard' , (req , res)=>{
    return res.sendFile(path.join(__dirname , '../static-files/html-files/admin-login.html'));
});

adminRouters.post('/dashboard' , async(req , res)=>{
    const {email , password} = req.body;
    const admin = await getAdmin(email , password);
    if(admin){
        req.session.adminId = admin.admin_id;
        console.log(`Admin ✅`);
        return res.redirect('/admin/homepage');
    }
    
    console.log(`Not admin ❌`);
    return res.redirect('/admin/dashboard');
})

adminRouters.get('/homepage' , isAdmin ,(req , res)=>{
    return res.sendFile(path.join(__dirname , "../static-files/html-files/admin-homepage.html"));
});

adminRouters.get('/projects' , isAdmin ,async (req , res)=>{
    const projects = await getProjects();
    if(!projects){
        return res.status(500).send('Internal issues ..');
    }

    return res.render("admin-projects" ,{
        projects : projects
    });
});

adminRouters.get('/projects/:id/delete', async(req , res)=>{

    const projectId = req.params.id;
    const removeProject = await deleteProjects(projectId);
    
    return res.redirect('/admin/projects');
    
});

adminRouters.get('/announcements' , isAdmin , async(req , res)=>{

    const announcements = await getAnnouncements();
    console.log(announcements);
    return res.render("admin-announcements" , {
        announcements : announcements
    });
});

adminRouters.get('/announcements/:id/delete' , async (req , res)=>{

    const announcementId = req.params.id;
    const removeAnnoucements = await deleteAnnouncement(announcementId);

    return res.redirect('/admin/announcements');
});

adminRouters.get('/categories' , isAdmin ,async(req , res)=>{

    const categories = await getCategories();
    return res.render('admin-categories' , {
        categories : categories
    });

});

// adminRouters.post('/categories' , isAdmin , async(req , res)=>{

//     const {categoryName , description} = req.body;
//     const createCategory = await addCategory(categoryName , description);

//     if(!createCategory){
//         console.log('Category failed..');
//        return res.send('Internal issues'); 
//     }

//     return res.redirect('/admin/categories');

// });

adminRouters.post('/categories/delete' , async(req , res)=>{

    const {projectId} = req.body;
    console.log('ID : ',projectId);
    const removeCategory = await deleteCategory(projectId);

    if(!removeCategory){
        return res.send('Internal issues..');
    }

    return res.redirect('/admin/homepage');
});



module.exports = adminRouters;