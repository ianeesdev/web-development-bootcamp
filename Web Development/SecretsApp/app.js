const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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
    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        email: username,
        password: password
    });

    newUser.save((error) => {
        if (!error) {
            res.render("secrets");
        } else console.log(error);
    })
});

app.post("/login", (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({username: email}, (error, foundUser) => {
        if (!error) {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else console.log("Invalid password!");
            } else console.log("User not found!");
        } else console.log(error);
    });
});

app.listen(3000, () => {
    console.log("Server started...");
});