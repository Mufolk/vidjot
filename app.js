const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

//Connect to mongoose
mongoose.connect('mongodb://localhost:27017/vidjot-dev', {
    useNewUrlParser:true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Method Override Middleware
app.use(methodOverride('_method'));

//Express session Midleware
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}));

// Flash Connect Midleware
app.use(flash());

//Global Variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Index Route
app.get('/', (req, res) =>{
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//About Route
app.get('/about', (req, res) =>{
   res.render('about');
});

//Idea Index Page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index',{
                ideas:ideas
            });
        });

});

//Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
           idea:idea
        });
    });
});

// Process Form
app.post('/ideas', (req, res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }

    if(!req.body.details){
        errors.push({text:'Please some details'});
    }

    if(errors.length >0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video Idea Added');
                res.redirect('/ideas');
            });
    }
});

//Edit Form Process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //new values
        idea.tittle = req.body.title;
        idea.details = req.body.details;

        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Video Idea Updated');
                res.redirect('/ideas');
            })
    });
});

//Delete Idea
app.delete('/ideas/:id', (req,res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
        req.flash('success_msg', 'Video Idea Removed');
        res.redirect('/ideas')
    });
});

const port = 5000;

app.listen(port, () => {
    console.log('Server started on port: ' + port);
});