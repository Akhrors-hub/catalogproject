const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//  Bring in user Models
let User = require('../models/user');




/// Register form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req, res){
  const name = req.body.name;
  const email =req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

req.checkBody('name', 'Name is required').notEmpty();
req.checkBody('email', 'Email is required').notEmpty();
req.checkBody('email', 'Email is not valid').isEmail();
req.checkBody('username', 'Username is required').notEmpty();
req.checkBody('password', 'Password is required').notEmpty();
req.checkBody('password2', 'Password does not match').equals(req.body.password);

let errors = req.validationErrors();

if(errors){
  res.render('register', {
    errors:errors
  });
}else{
  let newUser = new User({
    name:name,
    email:email,
    username:username,
    password:password
  });

  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newUser.password, salt, function(err, hash){
      if(err){
        console.log(err);
}
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
          console.log(err);
          return;
        } else {
          req.flash('success','You are now registered and can log in');
          res.redirect('/users/login');
        }

      });
});
});



}


});
// Login form
router.get('/login', function(req, res){
  res.render('login');
});


// login Proccess
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});


// logout
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if(err) {return next(err); }
    req.flash('success','You are logged out');
    res.redirect('/users/login');
  });

  });

module.exports = router;
