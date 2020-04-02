 
var mongoose = require("mongoose");

var caseSchema = new mongoose.Schema({
  casetype: String,
  filingdate: String,
  regno: String,
  cnrno: String,
  nexthearing: String,
  stage: String,
  courtname: String,
  clientname: String,
  lawyername: String,
  authid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Case", caseSchema);