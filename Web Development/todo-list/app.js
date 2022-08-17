const express = require('express');
const bodyparser = require('body-parser');
const _ = require("lodash");
const mongodb = require("mongodb");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

const password = encodeURIComponent("test12345678");
mongoose.connect(`mongodb://anees:${password}@ac-abfzmzp-shard-00-00.mcint3l.mongodb.net:27017,ac-abfzmzp-shard-00-01.mcint3l.mongodb.net:27017,ac-abfzmzp-shard-00-02.mcint3l.mongodb.net:27017/?ssl=true&replicaSet=atlas-m1cic3-shard-0&authSource=admin&retryWrites=true&w=majority`);

const itemsSchema = {
    name: {
        type: String,
        required: [true, "Please insert an item"]
    }
}
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
    Item.find({}, (error, result) => {
        if (result.length === 0) {
            Item.insertMany(defaultItems, (error) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log("Items successfully added!");
                }
            });
            res.redirect('/');
        } else {
            res.render("list", {title: "Today", newListItems: result});
        }
    });
});

app.get("/:listName", (req, res) => {
    const customListName = _.capitalize(req.params.listName);
    List.findOne({name: customListName}, (error, foundList) => {
        if (!error) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save();
                res.redirect("/" + customListName);
            } else {
                res.render("list", {title: foundList.name, newListItems: foundList.items});
            }
        }
    })
    
});

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.button;

    const newItem = new Item({
        name: itemName
    });

    if (listName === "Today") {
        newItem.save();
        res.redirect('/');
    } else {
        List.findOne({name: listName}, (error, foundList) => {
            if (!error) {
                foundList.items.push(newItem);
                foundList.save();
            } else console.log(error);
        })
        setTimeout(() => {
            res.redirect("/" + listName);
        }, 200);
    }
});

app.post("/delete", (req, res) => {
    const itemID = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.findByIdAndRemove(itemID, (error) => {
            if (error) {
                console.error(error);
            } else {
                console.log("Item deleted successfully!");
                res.redirect("/");
            }
        })
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemID}}}, (error, listFound) => {
            if (!error) {
                res.redirect("/" + listName);
            }
        })
    }
    
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("Server has started Successfully!");
});