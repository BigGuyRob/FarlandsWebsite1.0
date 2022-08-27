

require('dotenv').config()
var express = require('express');
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const fs = require("fs");
var app = express();
let ejs = require('ejs');
var bodyParser = require('body-parser');
app.set("view engine","ejs");

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "boobs",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(MONGOCONNECTIONSTRING', { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set("useCreateIndex", true); //remove deprecation warning

const playerSchema = new mongoose.Schema({
  ign: String,
  username: String,
  password: String
}); 

playerSchema.plugin(passportLocalMongoose, {usernameField: "username", passworldField: "password"});
const Player = new mongoose.model("Player", playerSchema);

passport.use(Player.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.serializeUser(Player.serializeUser());
passport.deserializeUser(Player.deserializeUser());

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

//GET METHODS
app.get("/", function(req, res){
  res.render("index");
});

app.get("/index", function(req, res){
  res.render("index");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/home", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/index");
});



app.post("/register", function(req, res){
  const newplayer = new Player({
    ign: req.body.mcname,
    username: req.body.username,
  });
 
  Player.register(newplayer, req.body.password, function(err, user){
    if(err){
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){   
        console.log("account created");
        res.redirect("/index");
      });
    }
  });

});

app.post("/login", function(req,res){

  const player = new Player({
    username: req.body.username,
    password: req.body.password
  });

  req.login(player, function(err){
    if(err){
      console.log(err);
      window.alert("Login failed please check your credentials and try again");
      res.redirect("/login");
      
    } else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/home");
      });
    }
  });

});



app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
