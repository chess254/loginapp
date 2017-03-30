var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//register
router.get('/register', function(req, res){
  res.render('register');
});
//ogin
router.get('/login', function(req, res){
  res.render('login');
});

//register user
router.post('/register', function(req, res){
  var name = req.body.name;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  //console.log(name);
  //console.log(username);
  //console.log(email);
  //console.log(password);
  //console.log(password2);

//validation
req.checkBody('name', 'Name is required').notEmpty();
req.checkBody('email','email is required').notEmpty();
req.checkBody('email','email is n0t valid').isEmail();
req.checkBody('username','username is required').notEmpty();
req.checkBody('password','password is required').notEmpty();
req.checkBody('password2','passwords do not match').equals(req.body.password);


var errors = req.validationErrors();
if(errors){
  res.render('register', {
    errors: errors
  });
//   console.log('yes');
  }else{
    //console.log('no');
      var newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
        });
      User.createUser(newUser, function(err, user){
          if (err) throw err;
          console.log(user);
      });
      req.flash('success_msg', 'You are registered and can now login');
      res.redirect('/users/login');
  }

});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'unknown user'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        console.log(user.name + " logged in")
        return done(null, user);
      } else{
        return done(null, false,{message:'Invalid password'});
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});


module.exports = router;
