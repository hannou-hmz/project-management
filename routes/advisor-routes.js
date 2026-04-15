const express = require('express');
const path = require('path');
const app = express();
const advisorRouters = express.Router();
const db = require('../mysql/db');
const {advisorDashboard , getRequests, getPendingRequests , createAdvisorProfile , updateAdvisorProfile} = require('../mysql/advisors');
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

advisorRouters.get('/requests' , async(req , res)=>{

    try{
        const advisorId = req.session.advisorId;
        const requests = await getRequests(advisorId);

        if(requests === null){
            console.log(requests);
            return res.status(500).send("Internal issues.");
        }

        return res.render("advisor-requests" , {
            requests : requests
        });
    }

    catch(e){
        return e.message;
    }

});




// advisorRouters.get('/accept/applicants' , isAdvisor , async(req , res)=>{

//     try{
//         const accept = await acceptApplication(studentId); // I need student id.
//         if(!accept || accept === null){
//             return res.status(500).render("500");
//         }

//         console.log(`Application accepted`);
//         return res.redirect('/student/applicants');
//     }

//     catch(e){
//         return e.message;
//     }

// });

// advisorRouters.get('/reject/applicants' , isAdvisor , async(req , res)=>{

//     try{
    
//         const reject = await rejectApplication(studentId); // Here also we need studentId
//         if(!reject || reject === null){
//             return res.status(500).render("500");
//         }

//         console.log(`Application rejected`);
//         return res.redirect('/student/applicants');
//     }

//     catch(e){
//         return e.message;
//     }

// });



module.exports = advisorRouters;