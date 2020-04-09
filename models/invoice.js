var mongoose = require("mongoose");

var invoiceSchema = new mongoose.Schema({
  lname: String,
  cname: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    default: "Unpaid",
  },
  amount: String,
  duedate: String,
});

module.exports = mongoose.model("Invoice", invoiceSchema);
