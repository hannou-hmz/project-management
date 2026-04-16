const express = require('express');
const path = require('path');
const app = express();
const advisorRouters = express.Router();
const db = require('../mysql/db');
const {advisorDashboard , getRequests, getPendingRequests ,acceptRequest , rejectRequest} = require('../mysql/advisors');
const { getUser , getUserById } = require('../mysql/users');


function isAdvisor(req, res, next){
    if(!req.session.advisorId){
        console.log('No advisor session .. redirecting ..');
        return res.redirect('/login');
    }
    next();
}


advisorRouters.get('/homepage' , isAdvisor, async(req , res)=>{

    try{
        const advisorId = req.session.advisorId;
        const advisor = await getUserById(advisorId);
        const pendingReq = await getPendingRequests();
        if(advisor === null || pendingReq === null){
            console.log(advisor);
            console.log(pendingReq);
            return res.status(500).send(`Internal issues ..`);
        }
        
        return res.render("advisor-homepage" , {
            advisor : advisor ,
            pending : pendingReq
        });
    }

    catch(e){
        return res.status(500).render("500");
    }
});

advisorRouters.get('/requests' , isAdvisor , async(req , res)=>{

    try{
        const advisorId = req.session.advisorId;
        const requests = await getRequests(advisorId);
        if(requests === null){
            return res.send("No requests found.");
        }
        return res.render("advisor-requests" , {
            requests : requests
        });
    }

    catch(e){
        return e.message;
    }

});

advisorRouters.get('/requests/:requestId/accept' , isAdvisor , async(req , res)=>{
    
    try{
        const requestId = req.params.requestId;
        const accept = await acceptRequest(requestId);

        if(accept === null){
            console.log("acceptance failed ..");
            return res.status(500).send("internal issues");
        }

        return res.redirect('/advisor/homepage');
    }
    catch(e){
        return e.message;
    }
});

advisorRouters.get('/request/:requestId/reject' , isAdvisor , async(req , res)=>{

    try{
        const requestId = req.params.requestId;
        const reject = await rejectRequest(requestId);

        if(reject === null){
            console.log("acceptance failed ..");
            return res.status(500).send("internal issues");
        }

        return res.redirect('/advisor/homepage');
    }
    catch(e){
        return e.message;
    }
});





module.exports = advisorRouters;