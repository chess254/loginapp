var express = require('express');
var router = express.Router();
var User = require('../models/user');
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


module.exports = router;
