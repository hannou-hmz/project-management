const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const filePath = 'C:\\Users\\USER\\Desktop\\project-management\\public';
const router = require('./webRoutes/routes');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(filePath, 'public')));
// app.use(session({

// }));

app.get('/admin/dashboard' , router);
app.post('/admin/dashboard' , router);

app.get('/' , router);

app.get('/student/login' , router);
app.post('/student/login' , router);

app.get('/student/signup' , router);
app.post('/student/signup' , router);

app.get('/advisor/login' , router);
app.post('/advisor/login' ,router);

app.get('/advisor/signup' , router);
app.post('/advisor/signup' , router);

app.use((req , res)=>{
    return res.status(404).send('<h1>Page Not Found</h1>');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT , ()=>{console.log(`Server running on port ${PORT}`)});
