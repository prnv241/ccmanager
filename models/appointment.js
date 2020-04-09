var mongoose = require("mongoose");

var appointSchema = new mongoose.Schema({
  lname: String,
  cname: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: String,
  time: String,
});

module.exports = mongoose.model("Appointment", appointSchema);
