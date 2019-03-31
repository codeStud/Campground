var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User    = require("../models/user");

router.get("/", function(req, res){
    res.render("landing")
});


//================
// AUTH. ROUTES
//================

//========REGISTER ROUTE==========//
// show register form
router.get("/register", function(req, res){
    res.render("register");
});
// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
       }
       
       // first register and then we are logging the user in...
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Campground " + user.username);
           res.redirect("/campgrounds");
       });
    });
});


// =========LOGIN ROUTE=========//
// show login form
router.get("/login", function(req, res){
    res.render("login");
});
// handle login logic
// use MIDDLEWARE to authenticate login before calling callback..
router.post("/login", passport.authenticate("local", 
    {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res){
        
});


//===============LOGOUT=============//
router.get("/logout", function(req, res) {
   req.logout(); 
   req.flash("success", "Logged you out!");
   res.redirect("/campgrounds");
});



// MIDDELWARE FOR /campgrounds/:id/comments/new//



module.exports = router;