const express = require('express');
const path = require('path');
const app = express();
const adminRouters = express.Router();
const db = require('../mysql/db');
const {getAdmin , getAllUsers , deleteUsers} = require('../mysql/users');
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

adminRouters.get('/announcements/add' , isAdmin ,async (req , res)=>{

    const categories = await getCategories();
    if(!categories || categories === null){
        return res.status(500).send("Internal issues..");
    }
    return res.render("admin-add-announcements" , {
        categories : categories
    });
});

adminRouters.post('/announcements/add', async(req , res)=>{

    try{
        const {category , title , description , isUrgent} = req.body;
        const newAnnouncement = await addAnnouncement(category , title , description , isUrgent);

        if(!newAnnouncement || newAnnouncement === null){
            return res.status(500).send("Internal issues");
        }

        return res.redirect('/admin/announcements');
    }

    catch(e){
        console.log(`Error : ${e.message}`);
    }
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

adminRouters.get('/categories/add', isAdmin , (req , res)=>{

    return res.render("admin-add-category");
});

adminRouters.post('/categories/add', isAdmin ,async(req , res)=>{

    try{
        const {categoryName , categoryDescription} = req.body;
        const newCategory = await addCategory(categoryName , categoryDescription);

        if(!newCategory || newCategory === null){
            return res.status(500).send("Insertion failed ..");
        }

        return res.redirect('/admin/categories');
    }

    catch(e){
        console.log(`Problem ${e.message}`);
        return res.status(500).send("Internal issues");
    }
});

adminRouters.get('/categories/:categoryId/delete' , isAdmin , async(req , res)=>{
    try{

        const categoryId = req.params.categoryId;
        const removeCategory = await deleteCategory(categoryId);
        if(!removeCategory){
            return res.status(500).send("deletion failed");
        }

        return res.redirect('/admin/categories');
    }

    catch(e){
        console.log(`Error : ${e.message}`);
    }
});

adminRouters.get('/users/roles' , isAdmin , async(req , res)=>{

    try{
        const users = await getAllUsers();
        if(!users || users === null){
            return res.status(500).send("internal issues..");
        }

        return res.render("admin-users-roles" , {
            users : users
        });
    }

    catch(e){
        return e.message;
    }
});

adminRouters.get('/users/:userId/delete' , isAdmin , async(req , res)=>{

    try{
        const userId = req.params.userId;
        const removeUser = await deleteUsers(userId);

        if(!removeUser){
            return res.status(500).send("Internal issues");
        }

        return res.redirect('/admin/users/roles');
    }

    catch(e){
        return e.message;
    }
});


module.exports = adminRouters;