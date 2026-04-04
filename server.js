const express = require('express');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const {pool , testConnection} = require('./mysql/db');
const path = require('path');
const filePath = 'C:\\Users\\USER\\Desktop\\project-management\\public';
const router = require('./webRoutes/routes');
const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'root',
  password: 'root,locked',
  database: 'project_hub'
});

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname , 'public')));
app.use(express.static(path.join(__dirname , 'public/views')));
app.use(session({
    secret : "ne5e3Guess!t)",
    resave : false,
    saveUninitialized : false,
    store : sessionStore,
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


