 
var mongoose = require("mongoose");

var lawyerSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  special: String,
  propic: String,
  address: String,
  bio: String
});

module.exports = mongoose.model("Lawyer", lawyerSchema);
