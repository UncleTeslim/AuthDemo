var express  = require("express"),
 	mongoose = require("mongoose"),
 	passport = require("passport"),
 	bodyParser= require("body-parser"),
 	LocalStrategy = require("passport-local"),
 	passportLocalMongoose = require("passport-local-mongoose"),
	User 	  = require("./models/user"),
	port       = 3000;


mongoose.connect('mongodb://localhost/AuthDemoApp', { useNewUrlParser: true });


var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require("express-session")({
	secret: "Ronaldo is the GOAT",
	resave: false,
	saveUninitialized: false
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=============
//	ROUTES
//=============

app.get("/", function(req, res) {
	res.render("home");
});

app.get("/secret",isLoggedIn, function(req, res) {
	res.render("secret");
});

// Auth Routes

app.get("/signup", function(req, res){
	res.render("signup");
});

app.post("/signup", function(req, res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}),  req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("signup");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");
		});
	});
});

// LOGIN ROUTES

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login",passport.authenticate("local" , {
	successRedirect:"/secret",
	failureRedirect:"/login"
}) , function(req, res){
});

// LOGOUT ROUTES

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(port,  function() {
    console.log(`server has started!!!`);
});