var express = require('express');
var bp = require('body-parser');
require('dotenv').config();
var db = require('./models');
var ejsLayouts = require('express-ejs-layouts');

var app = express();

app.set('view engine', 'ejs');
app.use(bp.urlencoded({extended: false}));
app.use(express.static(__dirname + "/static"));
app.use(ejsLayouts);

// GET home route
app.get('/', function(req, res) {
  res.render('index');
});

// GET route that sends the form for POSTing
app.get('/authors/new', function (req, res) {
  res.render('authors/new');
})

// POST route for submitting form data
app.post('/authors', function(req, res) {
  db.author.create({
    name: req.body.name
  }).then(function(data) {
    res.redirect('/');
  });
});

app.get('/authors', function(req, res) {
  db.author.findById(1, {
    include: [db.post],
    where: {}
  }).then(function(author) {
    console.log(author.posts);
  }); 
});

app.get('/posts/new', function(req, res) {
  res.render('posts/new');
})

app.post('/posts', function(req, res) {
  // 1. Find the current author
  db.author.findById(1).then(function(author) {
    // 2. Create a post specifically for that author
    author.createPost({
      title: req.body.title,
      content: req.body.content
    }).then(function(post) {
      res.redirect('/');
    });
  });
});

app.listen(process.env.PORT || 3000);