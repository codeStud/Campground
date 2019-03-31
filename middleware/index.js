// all the middleware goes here
// add evrything to middlewareObj and then export it
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    // is user logged in?
    if(req.isAuthenticated()){
        
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground Not found");
            // redirect back to previous page
            res.redirect("back");
            } else{
                // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
            if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
            // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
               // does user own campground?
            //   if(foundCampground.author.id === req.user._id) wont work as
            // req.user._id is string and foundCampground is an object
              if(foundCampground.author.id.equals(req.user._id)){
                  // move ahead and delete/ edit / update
                    next();
              } else{
                  req.flash("error", "Permission Denied!!!");
                  // redirect back to previous page
                  res.redirect("back");
              }
            }
        });
        
    } else{
        req.flash("error", "You need to be Logged in first!");
        // takes back to previous page
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in?
    if(req.isAuthenticated()){
        
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err || !foundComment){
            req.flash("error", "Comment Not found");
            // redirect back to previous page
            res.redirect("back");
            } else{
               // does user own comment?
            //   if(foundComment.author.id === req.user._id) wont work as
            // req.user._id is string and foundComment is an object
              if(foundComment.author.id.equals(req.user._id)){
                  // move ahead and delete/ edit / update
                    next();
              } else{
                  req.flash("error", "Permission Denied!!!");
                  // redirect back to previous page
                  res.redirect("back");
              }
            }
        });
        
    } else{
        req.flash("error", "You need to be Logged in first!");
        // takes back to previous page
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    
    // including flash messages
    // key-value pair... key=error and value=Please login First!
    // Must be done BEFORE redirecting
    req.flash("error", "You need to be Logged in!!");
    res.redirect("/login");
}



module.exports = middlewareObj;