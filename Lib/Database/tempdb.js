// tempdb
 
  const mongoose = require('mongoose');  
  const TempDb = new mongoose.Schema({
    id: { type: String,  unique: true ,required: true, default:"Ǫʋɛɛи ℓʋcκιℓʏ Ѵ1"},
    creator: { type: String, default: "Ǫʋɛɛи ℓʋcκιℓʏ Ѵ1" },
    data: { type: Object, default: {} }
  });  
  const dbtemp = mongoose.model("dbtemp", TempDb)
  module.exports = { dbtemp }