var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: String,
  role: String,
  roleId: {type: mongoose.Schema.Types.ObjectId, unique: true}
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
