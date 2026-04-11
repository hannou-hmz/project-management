const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const db = require('../mysql/db');
const {createUser , getAdmin , getUser} = require('../mysql/users');
const {createAdvisorProfile , updateAdvisorProfile} = require('../mysql/advisors');
const {modifyStudenPhoto , modifyStudenSkills , modifyStudenBio} = require('../mysql/students');
const {addAnnouncement , getAnnouncements} = require('../mysql/announcements');
const {createProjects , getProjects , myProjects} = require('../mysql/projects');

router.get('/admin/dashboard' , (req , res)=>{
    return res.sendFile(path.join(__dirname , '../static-files/html-files/admin.html'));
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
    return res.sendFile(path.join(__dirname ,'../static-files/html-files/homepage.html'));
});

router.get('/student/homepage' , (req , res)=>{
    if(!req.session.userId){
        console.log('NO session . back to login ...');
        return res.redirect('/login');
    }
    
    return res.sendFile(path.join(__dirname ,'../static-files/html-files/student-home.html'));
});

router.get('/advisor/homepage' , (req , res)=>{
    if(!req.session.userId){
        console.log('NO session . back to login ...');
        return res.redirect('/login');
    }

    return res.sendFile(path.join(__dirname ,'../static-files/html-files/advisor-home.html'));
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
   return res.sendFile(path.join(__dirname , '../static-files/html-files/login.html'));
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
   return res.sendFile(path.join(__dirname , '../static-files/html-files/signup.html'));
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
    return res.sendFile(path.join(__dirname , '../static-files/html-files/announcement.html'));
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

    return res.sendFile(path.join(__dirname , '../static-files/html-files/project.html'));
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

router.get('advisor/profile' , async(req , res)=>{
    
});

router.post('advisor/profile' , async(req , res)=>{

});




// router.get('/profile' , async (req , res)=>{
//     if(!req.session.userId){
//         console.log(`No session .. redirecting ..`);
//         return res.status(302).redirect('/login');
//     }

//     try{
//             const userId = req.session.userId;
//             const sql = "SELECT u.full_name , u.email FROM users AS u WHERE user_id = ?";
//             const sql2 = "SELECT d.department_name FROM users AS u INNER JOIN departments AS d ON d.department_id = u.department WHERE user_id = ?"
            
//             const [result] = await db.pool.execute(sql , [userId]);
//             const [result2] = await db.pool.execute(sql2 , [userId]); // returns the department ex "software engineering"

//             if(result.length === 0 || result2.length === 0){
//                 return res.status(500).send('Internal issues');
//             }

//             return res.render("profile" , {
//                 profile_photo : result[0] || null,
//                 fullName : result[0].full_name,
//                 email : result[0].email,
//                 department : result2[0].department_name,
//                 skills : result[0].skills || null,
//                 bio : result[0].bio || null
//             });
//     }

//     catch(e){
//         console.log(`Profile : ${e.message}`);
//         return false;
//     }
    
// });

// router.post('/profile/edit' ,async (req ,res)=>{

//     const {photo , skills , bio} = req.body;
//     const id = req.session.userId
//     const profilePhoto = await modifyStudenPhoto(id , photo);

//     if(skills != null){
//         const skill = await modifyStudenSkills(id , skills);
//     }

//     else if(profilePhoto){

//     }
    
//     else if(bio != null){
//         const stBio = await modifyStudenBio(id , bio);
//     }
    
// });

module.exports = router;