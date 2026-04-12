const express = require('express');
const path = require('path');
const app = express();
const advisorRouters = express.Router();
const db = require('../mysql/db');
const {createUser , getAdmin , getUser} = require('../mysql/users');
const {createAdvisorProfile , updateAdvisorProfile} = require('../mysql/advisors');


function isAdvisor(req, res, next){
    if(!req.session.advisorId){
        console.log('No advisor session .. redirecting ..');
        return res.redirect('/login');
    }
    next();
}


advisorRouters.get('/homepage' , isAdvisor, (req , res)=>{

    return res.sendFile(path.join(__dirname ,'../static-files/html-files/advisor-home.html'));
});



module.exports = advisorRouters;