require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save((error) => {
            if (!error) {
                res.render("secrets");
            } else console.log(error);
        })
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, (error, foundUser) => {
        if (error) {
            console.log(error);
        } else {
            bcrypt.compare(password, foundUser.password, (error, result) => {
                if (!error) {
                    if (result) {
                        res.render("secrets");
                    } else console.log("Invalid password!");
                } else console.log(error);
            });
        }
    });
});

app.listen(3000, () => {
    console.log("Server started...");
});