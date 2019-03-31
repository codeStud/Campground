var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");      // automatically 'requires' the content of file name "index.js". That's why we named it so.


// INDEX - show list of all campgrounds
router.get("/campgrounds", function(req, res){
    //get all campgrounds from database
    Campground.find({}, function(err, result){
       if(err){
           console.log("Something went wrong!");
       }else{
            res.render("campgrounds/index", {campgrounds: result});
       }
    });
});



// NEW - show a form for new campground
router.get("/campgrounds/new", middleware.isLoggedIn ,function(req, res){
   res.render("campgrounds/new"); 
});



// CREATE - add a new campground to database
router.post("/campgrounds", middleware.isLoggedIn ,function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    // push it into campground database
    // but we need to push an object. SO, making an object out of form data
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};

    // create a new campground and save it to database
    Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log("ERROR!!");
       }else{
         //redirect back to campground page
          res.redirect("/campgrounds");      
       }
    });
});



// SHOW - show detailed info of A PARTICULAR campground
// It shud be below /campgrounds/new otherwise it will catch that route also
router.get("/campgrounds/:id", function(req, res){
    // find campground with provided id
    
    //populating cuz one campground will have many comments
    // see rough notes just befor MODULE.EXPORTS
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       
        if(err || !foundCampground){
            req.flash("error", "Campground doesn't exist");
            return res.redirect("back");
        }else{
                
              //render show template with that campground
               res.render("campgrounds/show", {campground: foundCampground})  
        }
        
    });
});


//==============//
// EDIT CAMPGROUND ROUTE//
//==============//
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        
        // will reach this point after checking campgroundOwnership
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});         // inside views dir
         
      });
});


//=================//
// Update Campground Route //
//==================//
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
             // then  redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});


//============//
// DESTROY Campground Route //
//============//
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else{
            req.flash("success", "Campground deleted!");
            res.redirect("/campgrounds");
        }
    });
});


// MIDDELWARE FOR /campgrounds/:id/comments/new//


module.exports = router;