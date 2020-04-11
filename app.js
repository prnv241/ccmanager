var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");

var caseRoutes = require("./routes/case");
var clientRoutes = require("./routes/cliutl");
var lawyerRoutes = require("./routes/lawutl");
var indexRoutes = require("./routes/index");
var profileRoutes = require("./routes/profile");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(
  require("express-session")({
    secret: "This app is a really great application!",
    resave: false,
    saveUninitialized: false,
  })
);

mongoose
  .connect(
    "mongodb+srv://global:pranav@cluster0-noe9k.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log("ERROR:", err.message);
  });

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.use(function (req, res, next) {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(caseRoutes);
app.use(clientRoutes);
app.use(lawyerRoutes);
app.use(indexRoutes);
app.use(profileRoutes);

const PORT = 3000;
const HOSTNAME = "127.0.0.1";

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
