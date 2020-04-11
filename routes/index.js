var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Lawyer = require("../models/lawyer");
var Client = require("../models/client");
var MiddleFun = require("../middlewares/authwares");

router.get("/", function (req, res) {
  res.render("landing");
});

router.get("/login", function (req, res) {
  res.render("auth/login");
});

router.get("/signup", function (req, res) {
  res.render("auth/signup");
});

router.post("/signup", function (req, res) {
  var newUser = new User({ username: req.body.username, role: req.body.role });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", "Something went Wrong!");
      res.redirect("/signup");
    }
    passport.authenticate("local")(req, res, function () {
      if (user.role == "Lawyer") {
        req.flash(
          "success",
          "Take a minute to create your profile before you continue!"
        );
        res.redirect("/profile/lawyer/new");
      } else if (user.role == "Client") {
        req.flash(
          "success",
          "Take a minute to create your profile before you continue!"
        );
        res.redirect("/profile/client/new");
      }
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res) {
  req.logOut();
  req.flash("error", "Logged you out!");
  res.redirect("/");
});

router.get("/dashboard", MiddleFun.isLoggedIn, function (req, res) {
  if (req.user.role == "Lawyer") {
    Client.find({}, function (err, cli) {
      if (err) {
        console.log(err.message);
        req.flash("error", "Something went Wrong!");
        res.redirect("/");
      } else {
        Lawyer.findOne({ _id: req.user.roleId })
          .populate("cases")
          .populate("appointments")
          .populate("invoices")
          .exec(function (err, law) {
            if (err) {
              console.log(err.message);
              req.flash("error", "Something went Wrong!");
              res.redirect("/");
            } else {
              res.render("dashboard", { info: law, cli: cli });
            }
          });
      }
    });
  } else {
    Lawyer.find({}, function (err, law) {
      if (err) {
        console.log(err.message);
        req.flash("error", "Something went Wrong!");
        res.redirect("/");
      } else {
        Client.findOne({ _id: req.user.roleId })
          .populate("cases")
          .populate("appointments")
          .populate("invoices")
          .exec(function (err, cli) {
            if (err) {
              console.log(err.message);
              req.flash("error", "Something went Wrong!");
              res.redirect("/");
            } else {
              res.render("dashboard", { info: cli, law: law });
            }
          });
      }
    });
  }
});

router.get("/getstarted", function (req, res) {
  res.render("getstarted");
});

router.get("/aboutus", function (req, res) {
  res.render("aboutus");
});

module.exports = router;
