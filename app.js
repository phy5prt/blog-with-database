//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
