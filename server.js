const express = require('express');
const app = express();
const session = require('express-session');
const {MongoStore} = require('connect-mongo');
const {pool , testConnection} = require('./mysql/users');
const path = require('path');
const filePath = 'C:\\Users\\USER\\Desktop\\project-management\\public';
const router = require('./webRoutes/routes');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname , 'public')));
app.use(session({
    secret : "ne5e3Guess!t)",
    resave : false,
    saveUninitialized : false,
    store : MongoStore.create({
        mongoUrl : "mongodb://127.0.0.1:27017/teamPlatform"
    }),
    cookie : {
        secure : false,
        httpOnly : true,
        maxAge : 1000 * 60 * 60
    }
}));

app.get('/admin/dashboard' , router);
app.post('/admin/dashboard' , router);

app.get('/' , router);
app.get('/student/homepage' ,router);
app.get('/advisor/homepage' ,router);

app.get('/login' , router);
app.post('/login' , router);

app.get('/signup' , router);
app.post('/signup' , router);

app.get('/logout' , router);

app.use((req , res)=>{
    return res.status(404).send('<h1>Page Not Found</h1>');
});

async function startServer(){
    const PORT = process.env.PORT || 4000;
    const CONNECTED = await testConnection();
    if(!CONNECTED){
        console.log('❌ NO Connection found..');
    }
    else{
        app.listen(PORT , ()=>{ 
            console.log(`Server running on port ${PORT}`)
        });
    }
}

startServer();


