const express = require('express');
const router = express.Router();

//  Bring in Article Models
let Article = require('../models/article');

//  Bring in Article Models
let User = require('../models/user');




const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// how to add route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article', {
    title:'Add article'
  });
});



//Add Submit POST Route
router.post('/add', function(req, res){

req.checkBody('title','Title is required').notEmpty();
// req.checkBody('author','Author is required').notEmpty();
req.checkBody('body','Body is required').notEmpty();

// Get Errors
let errors = req.validationErrors();

if(errors){
  res.render('add_article', {
    title:'Add Article',
    errors:errors
  });
} else {
  console.log('yes , you hacked this');
    let article = new Article();
    article.title =req.body.title;
    article.author =req.user._id;
    article.body =req.body.body;
    article.catogories = ["test"]

    console.log(req.body.body);

  article.save(function(err){
  if(err){
    console.log(err);
  }else{
    req.flash('success','Article added');
    res.redirect('/');
  }
  })

}

});

// Load Edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      tite:'Edit Article',
      article: article
    });
  });
})

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
console.log('yes , you hacked this');
  let article = {};
  article.title =req.body.title;
  article.author =req.body.author;
  article.body =req.body.body;
  //onsole.log(req.body.body);
  let query = {_id:req.params.id}

Article.update(query, article, function(err){
if(err){
  console.log(err);
}else{
  res.redirect('/');
}

})
});




// Delete articles
router.delete('/:id', function(req, res){
if(!req.user._id){
  res.status(500).send();
}



  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success')
      });
    }
  });
  });


// Get Single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err, user){
      res.render('article', {
        article: article,
        author: user.name

    });
    });
  });
});


// Access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
