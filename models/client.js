 
var mongoose = require("mongoose");

var clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  propic: String
});

module.exports = mongoose.model("Client", clientSchema);
