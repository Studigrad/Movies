const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const { Sequelize,DataTypes,Model,Op } = require('sequelize');
const fs = require("fs");
const methodOverride = require('method-override');
const session = require('express-session');
const User = require('./models/user')
const Movie = require('./models/movies')
var newData = require('./controllers/dataParse')
const db = require('./controllers/connect')
app = express();

db();

const port = process.env.PORT ?? 8050
app.use(session({ secret: 'secret' }))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

let name=''; 

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

for(let text of newData){
    console.log(text)
}

var isMade = false;
app.get("/",async(req,res)=>{
    find();
    if(!isMade) {
        let i = 0
        for(let text of newData){
            var secondKey = Object.keys(newData[i])[1] 
            const newMovie = await Movie.create({ title: text.Title,year:newData[i][secondKey],format : text.Format, stars : text.Stars});
            console.log(newMovie.toJSON())
            i=i+1
        }
       
        isMade = true;
       }
   
   name= req.session.username ? req.session.username : 'User';
    res.render('index',{newData,name})
})

app.get('/new',(req,res)=>{
    res.render('new');
})
app.post('/new',async(req,res)=>{
    const {title,year,format,stars}=req.body;
    console.log(req.body)
    const newMovie = await Movie.create({ title: ' '+title,year:' '+year,format : ' '+format, stars : ' '+stars});
    const movies = await Movie.findAll();
    res.render('movies',{movies});
})
app.get('/movies',async(req,res)=>{
    const movies = await Movie.findAll();
    res.render('movies',{movies});
})
app.get('/movies/sorted',async(req,res)=>{
    const movies = await Movie.findAll({ order: [['title']]});
    console.log(movies);
    res.render('movies',{movies});
})
app.get('/movies/find',async(req,res)=>{
    const {find} = req.query;
    const movies =await Movie.findAll({
        where: {
          title: {
            [Op.eq]: " "+find
          }
        }
      });
    console.log(" "+find);
    
    console.log(JSON.stringify(movies,null,2));
    res.render('movies',{movies});
})
app.get('/movies/find2',async(req,res)=>{
    const {find} = req.query;
    const movies =await Movie.findAll({
        where: {
          stars: {
            [Op.eq]: " "+find
          }
        }
      });
    console.log(" "+find);
    
    console.log(JSON.stringify(movies,null,2));
    res.render('movies',{movies});
})
app.get('/movies/:id',async(req,res)=>{
    const id = req.params.id
    const foundMovie = await Movie.findOne({ where: { id: id } });;
    res.render('foundMovie',{foundMovie});
})
app.post('/movies/:id',async(req,res)=>{
    const id = req.params.id;
    await Movie.destroy({ where: { id: id}});
    const movies = await Movie.findAll();
    res.render('movies',{movies})
})
app.get('/register',(req,res)=>{
    res.render("authorizations/register")
})
app.post('/register',async(req,res)=>{

    const {username,email,password}=req.body;
    const newUser = await User.create({ username: username ,email:email,password:password});
    req.session.user_id = newUser.id;
    req.session.username = newUser.username;
    const id =req.session.user_id;
    name= req.session.username ? req.session.username : 'User';
    res.render("index",{newData,name})
    console.log(req.body)

})

app.get('/login',(req,res)=>{
    res.render("authorizations/login")
})  
const findAndValidate = async function (username, password1) {
    const foundUser = await User.findOne({ where: { username: username } });
    if(foundUser.password ==password1){
        return isValid =true
    }
    else {
        return isValid =false
    }
    
}
app.post('/login',async(req,res)=>{
    const { username, password } = req.body;
    let found = findAndValidate(username, password);
   
    if (found) {
        const foundUser = await User.findOne({ where: { username: username } });
        req.session.user_id = foundUser.id;
        req.session.username = foundUser.username;
        name = req.session.username ? req.session.username : 'User';
        res.render('index',{newData,name});
        console.log(foundUser.toJSON())
    }
    else {
        res.render('/login')
    }
})

app.get('/logout', (req, res) => {
    res.render("authorizations/logout")
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    req.session.username = null;
    res.render('authorizations/login');
})
  let find = async function(){
    const users = await User.findAll();
    console.log("All users:", JSON.stringify(users, null, 2));
 }
 


  app.listen(port,()=>{
      console.log('Server is running')
  })