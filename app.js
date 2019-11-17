//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = " You can add blog posts with the /compose route. The post are accessible through their title as the url. They are automatically added to the home page as well. This blog website uses node.js, atlas mongodb database and ejs for templates and partials. The data currently provided is some information from my CV rather than daily blog material.";
const aboutContent = "I've made this website along with several other websites, apps and software as part of my employment portfolio";
const contactContent = "You can contact me on my contact page on my portfolio website through the contact page or using my contact details on my portfolio site";








const app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://phy5prtAdmin:"+process.env.PASSWORD_ATLASDB+"@cluster0-su305.mongodb.net/blogPostDB", {useNewUrlParser: true});

// const Schema = mongoose.Schema;
// const blogSchema = new Schema({
//   Title: String,
//   Content: String
// });
const blogSchema = {
 Title: String,
  Content: String
 };

const BlogPost = mongoose.model("BlogPost", blogSchema);

app.set('view engine', 'ejs');



//need to put the starting content  as default post
// let posts = [];
//
// // just putting a thing in
// const blogTest = new BlogPost({Title: "testTitle", Content: "testContent"});
// BlogPost.create(blogTest,function(err){
//   if(err){console.log(err);}
// });

app.get("/", function(req, res){
  BlogPost.find({},function(err, foundBlogPosts){
    if(err){console.log(err);}
    else{
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundBlogPosts
        });

    }
  });

});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){

// console.log(blogTitle + " .... " + blogContent);
  const blogPost = new BlogPost(
    {Title: req.body.postTitle,
    Content: req.body.postBody}
  );
//error needs an id before saving
blogPost.save(function(err){
  if(!err){res.redirect("/");}else{console.log(err);}});
  // posts.push(post);

});

app.get("/posts/:postName", function(req, res){
  // const requestedTitle = _.lowerCase(req.params.postName);
const requestedTitle = req.params.postName;

  BlogPost.findOne(
    {Title: requestedTitle},
    function(err, foundBlog){
//     if(!err){
//       if(!foundBlog){ console.log("no post with title " + requestedTitle);
// res.redirect("/");
// }else{
  res.render("post",{
    title:foundBlog.Title,
    content:foundBlog.Content
  });
});
});





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
