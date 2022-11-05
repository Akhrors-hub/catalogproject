const express = require('express');
const router = express.Router();

//  Bring in Catalog Models
let Catalog = require('../models/catalog');

//  Bring in Catalog Models
let User = require('../models/user');




const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// how to add route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_catalog', {
    title:'Add catalog'
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
  res.render('add_catalog', {
    title:'Add Catalog',
    errors:errors
  });
} else {
  console.log('yes , you hacked this');
    let catalog = new Catalog();
    catalog.title =req.body.title;
    catalog.author =req.user._id;
    catalog.body =req.body.body;
    catalog.catogories = ["test"]

    console.log(req.body.body);

  catalog.save(function(err){
  if(err){
    console.log(err);
  }else{
    req.flash('success','Catalog added');
    res.redirect('/');
  }
  })

}

});

// Load Edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Catalog.findById(req.params.id, function(err, catalog){
    if(catalog.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_catalog', {
      tite:'Edit Catalog',
      catalog: catalog
    });
  });
})

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
console.log('yes , you hacked this');
  let catalog = {};
  catalog.title =req.body.title;
  catalog.author =req.body.author;
  catalog.body =req.body.body;
  //onsole.log(req.body.body);
  let query = {_id:req.params.id}

Catalog.update(query, catalog, function(err){
if(err){
  console.log(err);
}else{
  res.redirect('/');
}

})
});




// Delete catalogs
router.delete('/:id', function(req, res){
if(!req.user._id){
  res.status(500).send();
}



  let query = {_id:req.params.id}

  Catalog.findById(req.params.id, function(err, catalog){
    if(catalog.author != req.user._id){
      res.status(500).send();
    } else {
      Catalog.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success')
      });
    }
  });
  });


// Get Single catalog
router.get('/:id', function(req, res){
  Catalog.findById(req.params.id, function(err, catalog){
    User.findById(catalog.author, function(err, user){
      res.render('catalog', {
        catalog: catalog,
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
