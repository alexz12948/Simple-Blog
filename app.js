const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

mongoose.connect("mongodb://localhost:27017/blog", options).
  catch(error => handleError(error));

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  storedTitle: {
    type: String,
    required: true
  }
});

const Post = mongoose.model('Post', postSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", function(req,res) {
  Post.find({}, function(err, posts) {
    res.render("home", { postList: posts });
  });
});

app.get("/about", function(req,res) {
  res.render("about");
});

app.get("/contact", function(req,res) {
  res.render("contact");
});

// Creates get/post page to be able to make unique paths to each post
app.get("/posts/:postName", function(req,res) {
  const postName = _.lowerCase(req.params.postName);

  Post.findOne({ storedTitle: postName }, function(err, post) {
    if (err) console.log(err.reason);

    res.render("post", { post: post });
  });
});

app.post("/posts/:postName", function(req,res) {
  const postName = _.lowerCase(req.params.postName);

  Post.findOneAndDelete({ storedTitle: postName }, function(err) {
    if (err) console.log(err.reason);
  });

  res.redirect("/");
});

app.get("/compose", function(req,res) {
  res.render("compose");
});

app.post("/compose", function(req,res) {
  const post = new Post({
    title: req.body.title,
    body: req.body.newText,
    storedTitle: _.lowerCase(req.body.title)
  });

  post.save(function(err) {
    if (!err) res.redirect("/");
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
