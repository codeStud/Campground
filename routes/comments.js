var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");      // automatically 'requires' the content of file name "index.js". That's why we named it so.



//=========================
// COMMENTS ROUTE
//=========================

// It's a nested route. So, first goto /campground/id and then /comments/new
// MIDDLEWARE is included to check if logged in BEFORE ADDING COMMENT
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log("ERROR!!");
        }else{
             res.render("comments/new", {campground: campground});
        }
    });
});


// adding MIDDLEWARE to prevent someone not logged in to send a POST req for comment using POSTMAN
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
   //lookup campground using id
   Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
          console.log("Error!!");
          res.redirect("/campgrounds");
      } else{
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  res.flash("error", "Something went wrong!");
                  console.log(err);
              }else{
                  // add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  // save comment
                  comment.save();
                  
                  foundCampground.comments.push(comment);
                  foundCampground.save();
                  req.flash("success", "Successfuly added comment");
                  res.redirect("/campgrounds/" + foundCampground._id);
              }
          });
      }
   });
   
});

//=================//
//Edit route for comment//
//===================//
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {campgroundId: req.params.id, comment: foundComment});
        }
    });
});

//=============//
// Update route for comments//
//===============//
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//=================//
// DESTROY comment//
//================//
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
    // findById and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else{
           req.flash("success", "Comment deleted");
           // redirect to SHOW page
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});


// MIDDELWARE FOR /campgrounds/:id/comments/new//


module.exports = router; 