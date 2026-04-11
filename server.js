const express = require('express');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const {pool , testConnection} = require('./mysql/db');
const path = require('path');
const filePath = path.join(__dirname, 'public');
const router = require('./routes/routes');
const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'root',
  password: 'root,locked',
  database: 'project_hub'
});

app.set("view engine" , "ejs");

app.use(express.json());
app.use(express.urlencoded({extended : true}));
// app.use(express.static(path.join(__dirname , 'static-files')));
// app.use(express.static(path.join(__dirname , 'static-files/html-files')));
app.use(express.static(path.join(__dirname , 'static-files')));
app.use(session({
    secret : "ne5e3Guess!t)",
    resave : false,
    saveUninitialized : false,
    store : sessionStore,
    cookie : {
        secure : false,
        httpOnly : true,
        maxAge : 1000 * 60 * 60 * 2
    }
}));

app.use('/', router);

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


