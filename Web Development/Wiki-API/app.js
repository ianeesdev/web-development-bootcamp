const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

//route for getting or deleting all data
app.route("/articles")
.get((req, res) => {
    Article.find({}, (error, articles) => {
        if (!error) {
            res.send(articles);
        } else res.send(error);
    })
})

.post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((error) => {
        if (!error) {
            res.send("Successfully added to database!");
        } else res.send(error);
    });
})

.delete((req, res) => {
    Article.deleteMany((error) => {
        if (!error) {
            res.send("Deleted successfully!");
        }
    });
});


// route for specific delete/update/post requests
app.route("/articles/:articleTitle")

.get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (error, foundArticle) => {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("Article not found!")
        }
    })
})

.put((req, res) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        (error) => {
            if (!error) {
                res.send("Successfully updated article.")
            }
        }
    )
})

.delete((req, res) => {
    Article.deleteOne({title: req.params.articleTitle}, (error) => {
        if (!error) res.send("Article successfully deleted!");
        else req.send("Article not found!");
    })
});

app.listen(3000, () => {
    console.log("Server started...");
});