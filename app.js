//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
mongoose.connect("mongodb://localhost:27017/wikiDB").then((result) => {
    console.log("connected successfully");
}).catch((err) => {
    console.log("Error", err);
});


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));


const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema)

app.get("/", async function (req, res) {
    console.log("inside get");
    res.send("Welcome!");
})

app.route("/articles").get(async function (req, res) {
    const allArticles = await Article.find({}).then((result) => {
        console.log("Result", result);
        res.send(result)
    }).catch((err) => {
        console.log("Error", err);
    });
    res.send(allArticles)
}).post(async function (req, res) {
    const title = req.body.title
    console.log("🚀 ~ file: app.js:48 ~ title:", title)
    const content = req.body.content
    console.log("🚀 ~ file: app.js:50 ~ content:", content)

    const newArticle = new Article({
        title: title,
        content: content
    })
    console.log("🚀 ~ file: app.js:56 ~ newArticle:", newArticle)
    newArticle.save().then((result) => {
        console.log("Sucessfully ", result);
        res.send("Successfully added new article")
    }).catch((err) => {
        console.log("Error", err);
        res.send(err)
    });;
}).delete(async function (req, res) {

    Article.deleteMany().then((result) => {
        console.log("Result", result);
        console.log("Deleted all");
        res.send("All deleted successfully")
    }).catch((err) => {
        console.log("Error", err);
        res.send("Error while deleting")

    });
});

app.route("/articles/:articleTitle").get(async function (req, res) {
    Article.findOne({ title: req.params.articleTitle }).then((result) => {
        console.log("Result", result);
        if (result) {
            res.send(result)
        } else {
            res.send("Article not found")
        }
    }).catch((err) => {
        console.log("Error", err);
    });
}).put(async function (req, res) {
    Article.updateOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }).then((result) => {
        console.log("Result", result);
        res.send("Successfully updated")
    }).catch((err) => {
        console.log(err);
    });
}).patch(async function (req, res) {
    Article.updateMany({ title: req.params.articleTitle }, { $set: req.body }).then((result) => {
        console.log("Result", result);
        res.send("Successfully updated")
    }).catch((err) => {
        console.log(err);
        res.send(err)
    });
}).delete(async function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }).then((result) => {
        console.log("Result", result);
        res.send("Successfully deleted")
    }).catch((err) => {
        console.log("Error", err);
        res.send(err)

    });
})


app.listen(3000, function () {
    console.log("Server started on port 3000");
});