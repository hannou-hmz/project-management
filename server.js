require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const {pool , testConnection} = require('./mysql/db');
const methodOverride = require('method-override');
const path = require('path');
const adminRouters = require('./routes/admin-routes');
const studentRoutes = require('./routes/student-routes');
const advisorRouters = require('./routes/advisor-routes');
const authRoutes = require('./routes/auth-routes');
const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'root',
  password: 'root,locked',
  database: 'project_hub'
});

app.set("view engine" , "ejs");

app.use(methodOverride('_method')); // doesnt work for hidden forms
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'static-files')));
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
    store : sessionStore,
    cookie : {
        secure : false,
        httpOnly : true,
        maxAge : 1000 * 60 * 60 * 2
    }
}));

app.use('/' , authRoutes)
app.use('/admin' , adminRouters);
app.use('/student' , studentRoutes);
app.use('/advisor' ,advisorRouters);

app.use((req , res)=>{
    return res.render("404" , {
        title: "404 - Page Not Found",
        errorCode: 404,
        message: "The page you are looking for does not exist."
    });
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


