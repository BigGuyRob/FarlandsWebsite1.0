
var express = require('express')
var app = express();
let ejs = require('ejs');
var bodyParser = require('body-parser');
app.set("view engine","ejs");
var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

app.use(bodyParser.urlencoded({
  extended: true
}));


var firebaseConfig = {
    apiKey: "AIzaSyCsiT_qF9Zj3tjw8anqi_dIhw8C7QVvSF0",
    authDomain: "farlands-99705.firebaseapp.com",
    databaseURL: "https://farlands-99705.firebaseio.com",
    projectId: "farlands-99705",
    storageBucket: "farlands-99705.appspot.com",
    messagingSenderId: "250095971435",
    appId: "1:250095971435:web:5abce101cb9e90bade552e"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

//helper functions 
function createNewUser(userId, name, password) {
  database.ref('users/' + userId).set({
    username: name,
    password: password
  });
}

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
  res.render("index");
});

app.post("/register", function(req, res){
  createNewUser(req.body.mcname, req.body.mcname, req.body.psw); 
  res.render("index");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});