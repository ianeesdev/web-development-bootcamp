const express = require('express');
const bodyparser = require('body-parser');
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

let items = [];
let workItems = [];

app.get("/", (req, res) => {
    let day = date.getDate();
    res.render("list", {title: day, newListItems: items});
});

app.post("/", (req, res) => {
    let item = req.body.newItem;
    if (req.body.button === 'Work') {
        workItems.push(item);
        res.redirect("/work");
    }
    else {
        items.push(item);
        res.redirect("/");
    }
})

app.get("/work", (req, res) => {
    res.render("list", {title: "Work", newListItems: workItems});
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})