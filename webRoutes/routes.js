const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const {createUser , getAdmin , getUser} = require('../mysql/users');
const {addAnnouncement , getAnnouncements} = require('../mysql/announcements');
const {createProjects , getProjects , myProjects} = require('../mysql/projects');

router.get('/admin/dashboard' , (req , res)=>{
    return res.sendFile(path.join(__dirname , '../public/views/admin.html'));
});

router.post('/admin/dashboard' , async(req , res)=>{
    const {email , password} = req.body;
    const admin = await getAdmin(email , password);
    if(admin){
        console.log(`Admin ✅`);
        return res.send(`<h1>Admin panel</h1>`);
    }
    
    console.log(`Not admin ❌`);
    return res.status(404).send(`<h1>Not found</h1>`);
})
 // homepage
router.get('/' , (req , res , next)=>{
    return res.sendFile(path.join(__dirname ,'../public/views/homepage.html'));
});

router.get('/student/homepage' , (req , res)=>{
    if(!req.session.userId){
        console.log('NO session . back to login ...');
        return res.redirect('/login');
    }
    
    return res.sendFile(path.join(__dirname ,'../public/views/student-home.html'));
});

router.get('/advisor/homepage' , (req , res)=>{
    if(!req.session.userId){
        console.log('NO session . back to login ...');
        return res.redirect('/login');
    }

    return res.sendFile(path.join(__dirname ,'../public/views/advisor-home.html'));
});

router.get('/logout' , (req , res) =>{
    req.session.destroy((error)=>{
        if(error){
            console.log(error.message);
            return res.status(500).send(`<h1>Logout failed!</h1>`);
        }

        res.clearCookie('connect.sid');
        return res.redirect('/login');
    });
})

router.get('/login' , (req , res)=>{
   return res.sendFile(path.join(__dirname , '../public/views/login.html'));
});

router.post('/login' , async (req , res)=>{
    const {role , email , password} = req.body;
    const userRole = Number(role);
    const user = await getUser(userRole , email , password);

    if(user && userRole === 3){
        req.session.userId = user.user_id;
        return res.redirect('/student/homepage');
    }
    else if(user && userRole === 2){
        req.session.userId = user.user_id;
        return res.redirect('/advisor/homepage');
    }
    else{
        console.log('Wrong credentials');
        return res.redirect('/login');
    }
    
});

router.get('/signup' , (req , res)=>{
   return res.sendFile(path.join(__dirname , '../public/views/signup.html'));
});

router.post('/signup' , async (req , res)=>{
    const {role , username , age , email , department , password} = req.body;
    console.log(role);
    const user = await createUser(role , username , age ,email , department , password);
    if(user && role === '3'){
        req.session.userId = user.user_id;
        return res.status(200).redirect('/student/homepage');
    }
    else if(user && role === '2'){
        req.session.userId = user.user_id;
        return res.status(200).redirect('/advisor/homepage');
    }
    else{
        return res.status(422).send("Validation failed!");
    }     
});

router.get('/announcements' , async(req , res)=>{
    if(!req.session.userId){
        console.log(`NO session found , redirect ..`);
        return res.redirect('/login');
    }

    const announcements = await getAnnouncements();
    return res.send(announcements);
});

router.get('/announcements/api' , async (req , res)=>{
    if(!req.session.userId){
        console.log(`NO session found , redirect ..`);
        return res.redirect('/login');
    }
    return res.sendFile(path.join(__dirname , '../public/views/announcement.html'));
});

router.post('/announcements/api' , async (req , res)=>{
    const {category , title , description , isUrgent} = req.body;
    const announcementCategory = Number(category);
    const announcement = await addAnnouncement(announcementCategory , title , description , isUrgent);
    if(!announcement){
        return res.status(500).send(`Internal problems ..`);
    }

    return res.redirect('/student/homepage');
});

router.get('/student/projects' , (req , res)=>{
    if(!req.session.userId){
        console.log('No session found .. redirect');
        return res.redirect('/login');
    }

    return res.sendFile(path.join(__dirname , '../public/views/project.html'));
});

router.post('/student/projects' , async (req , res)=>{

    const {title , category , description , budget , skills , teamSize , reqAdvisor } = req.body;
    const createdBy = req.session.userId;

    try{
        const project = await createProjects(title , category , description , budget , skills , teamSize , reqAdvisor , createdBy);
        console.log(project);
        return res.redirect('/student/homepage');    
    } 
    catch(e){
        res.status(500).send(`Inernal error ...`);
    }
})

router.get('/projects' , async (req , res)=>{
    const project = await getProjects();
    if(!project){
        return res.status(500).send('Internal issues ..');
    }

    return res.status(200).json(project);
});

router.get('/myprojects' , async(req , res)=>{

    if(!req.session.userId){
        console.log(`No session found ... redirecting ..`);
        res.redirect('/login');
    }

    const createdBy = req.session.userId;
    const myproject = await myProjects(createdBy);

    if(!myProjects){
        return res.status(500).send(`Internal issues ...`);
    }

    return res.send(myproject);
});



module.exports = router;