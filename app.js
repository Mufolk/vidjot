const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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
                res.redirect('/ideas');
            });
    }
});

const port = 5000;

app.listen(port, () => {
    console.log('Server started on port: ' + port);
});