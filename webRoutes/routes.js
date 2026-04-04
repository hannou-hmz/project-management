const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();
const {createUser , getUser} = require('../mysql/users');

router.get('/admin/dashboard' , (req , res)=>{
    return res.sendFile(path.join(__dirname , '../public/views/admin.html'));
});

router.post('/admin/dashboard' , async(req , res)=>{
    const {email , password} = req.body;
    const admin = await findAdmin(email , password);
    if(admin){
        return res.send(`<h1>Admin panel</h1>`);
    }

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
    const user = await getUser(role , email , password);
    if(user && role === 'student'){
        req.session.userId = user.id;
        return res.redirect('/student/homepage');
    }
    else if(user && role === 'advisor'){
        req.session.userId = user.id;
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

    const user = await createUser(role , username , age ,email , department , password);
    if(user && role === 'student'){
        req.session.userId = user._id;
        return res.status(200).redirect('/student/homepage');
    }
    else if(user && role === 'advisor'){
        req.session.userId = user._id;
        return res.status(200).redirect('/advisor/homepage');
    }
    else{
        return res.status(422).send("Validation failed!");
    }
        
});

module.exports = router;