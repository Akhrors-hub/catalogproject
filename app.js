//expess js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser =require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const messages = require('express-messages');
const config = require('./config/database');
require('dotenv').config()
console.log(process.env) // remove this after you've confirmed it is working



//const DB_URI = 'mongodb://rs0:27018,rs1:27019,rs2:27020,rs3:27021,rs4:27022/test';
mongoose.connect(process.env.MONGO_URL);
let db = mongoose.connection;



//check connection
db.once('open', function(){
console.log('Connected to server');
});
  db.on('error', function(error){
    console.log('Your error', error);
  });








//init app
const app = express();

//  Bring in Models
let Article = require('./models/article');




//pug
//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));


// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,

}))

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express Validation Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root   = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));



// Passport config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// home rotue
app.get('/', function(req, res){
Article.find({}, function(err, articles){
  if(err){
    console.log(err);
  }else {


  res.render('index', {
    title: 'Hello there',
    articles: articles
    });
  }
  });
});


// Route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);


// start server
app.listen(3001, function(){
  console.log('Server started on port 3001....');
});
