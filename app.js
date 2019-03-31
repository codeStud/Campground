var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Campground   = require("./models/campground.js"),
    seedDB       = require("./seeds.js"),
    Comment      = require("./models/comment.js"),
    passport     = require("passport"),
    LocalStrategy= require("passport-local"),
    User         = require("./models/user.js"),
    flash        = require("connect-flash"),
    
    methodOverride   = require("method-override"),
    commentRoutes    = require("./routes/comments"),
    authRoutes       = require("./routes/auth"),
    campgroundRoutes = require("./routes/campgrounds"); 

// seedDB();        // seeding database with default data

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/campground_v11");
// to tell express to serve public dir... __dirname gives full path
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// EXPRESS SESSION CONFIG.
app.use(require("express-session")({
    secret: "This can be any random text",
    resave: false,
    saveUninitialized: false
}));


// PASSPORT CONFIG.
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   // comes with passport-local-mongoose

passport.serializeUser(User.serializeUser());           //  same as above
passport.deserializeUser(User.deserializeUser());       // same as above


// MIDDLEWARE that runs for all routes
// for displayin ONLY logout option for logged in user in header.ejs
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   
   // passing flash message to all the templates and routes
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   
   next();
});


// acquiring routes
app.use(authRoutes);
app.use(campgroundRoutes);          // app.use("/campgrounds", campgroundRoutes) to append this pattern to all of the capmgroundRoutes. Delete /campgrounds from campgroundRoutes file
app.use(commentRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!!")
});