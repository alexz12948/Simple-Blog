const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');

const app = express();
const posts = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", function(req,res) {
  res.render("home", {postList: posts});
});

app.get("/about", function(req,res) {
  res.render("about");
});

app.get("/contact", function(req,res) {
  res.render("contact");
});

app.get("/posts/:postName", function(req,res) {
  const postName = _.lowerCase(req.params.postName);

  posts.forEach(function(post) {
    if (_.lowerCase(post.title) === postName) {
      res.render("post", {post: post});
    }
  });
});

app.get("/compose", function(req,res) {
  res.render("compose");
});

app.post("/compose", function(req,res) {
  const post = {
    title: req.body.title,
    body: req.body.newText
  };

  posts.push(post);
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
