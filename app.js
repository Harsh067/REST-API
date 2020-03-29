const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("article", articleSchema);

///// Requests targetting all articles /////

app.route("/articles")

.get(function(req,res) {
  Article.find(function(err,resq) {
    if(!err){
        res.send(resq);
    } else {
      res.send(err);
    }
  });
})

.post(function(req,res) {
const newArticle = new Article({
  title: req.body.title,
  content: req.body.content
});
newArticle.save(function(err) {
  if(!err) {
    res.send("Successful!");
  } else{
    res.send(err);
  }
});
})

.delete(function(req,res) {
  Article.deleteMany(function(err) {
    if(!err) {
      res.send("Deleted all articles");
    } else {
      res.send(err);
    }
  });
});

///// Requests targetting a specific articles /////

app.route("/articles/:aTitle")

.get(function(req,res) {
  Article.findOne({title: req.params.aTitle}, function(err,resq) {
    if(resq) {
      res.send(resq);
    } else if(err){
      res.send(err);
    } else{
       res.send("Not found");
    }
  });
})

.put(function(req,res) {
  Article.update(
    {title: req.params.aTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err) {
    if(!err) {
      res.send("UPDATED");
    } else{
      res.send(err);
    }
  });
})

.patch(function(req,res) {
 Article.update(
   {title: req.params.aTitle},
   {$set: req.body},
   function(err) {
     if(!err) {
       res.send("Updated!");
     } else{
       res.send(err);
     }
   });
})

.delete(function(req,res) {
  Article.deleteOne({title: req.params.aTitle}, function(err) {
    if(!err) {
      res.send("Deleted!");
    } else {
      res.send(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
