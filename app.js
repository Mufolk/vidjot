const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

const app = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/database');

//Connect to mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser:true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

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

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Static Folder
app.use(express.static(path.join(__dirname, 'public ')));

// Flash Connect Midleware
app.use(flash());

//Global Variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
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

//Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server started on port: ' + port);
});