const express = require('express');
const bodyparser = require('body-parser');

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

let items = [];

app.get("/", (req, res) => {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    
    let day = today.toLocaleDateString("en-US", options);
    res.render("list", {kindOfDay: day, newListItems: items});
});

app.post("/", (req, res) => {
    let item = req.body.newItem;
    items.push(item);
    res.redirect("/");
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})