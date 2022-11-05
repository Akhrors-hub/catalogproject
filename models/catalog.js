let mongoose= require('mongoose');


// catalog schema

let catalogSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  catogories: {
    type: [String]
  }



});

let Catalog = module.exports = mongoose.model('Catalog', catalogSchema);
