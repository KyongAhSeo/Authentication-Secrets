//제일 위에 선언하는게 중요하다!
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const port = 3000;
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


// 패스워드만 암호화한다는것을 명시해줘여한다.
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User",userSchema);

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
  email: req.body.username,
  password: req.body.password
});

newUser.save(function(err){
    if(err){
      console.log(err);
    } else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  //데이터베이스상의 email과 login페이지에서 사용자가 입력한 email(=username)이 일치하는지 확인
  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else{
      //일치한다면 데이터베이스상의 password와 사용자가 입력한 password가 일치하는지 확인
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  });
});










app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
