var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Lawyer = require("../models/lawyer");
var Client = require("../models/client");

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
      return res.redirect("/signup");
    }
    passport.authenticate("local")(req, res, function () {
      if (user.role == "Lawyer") {
        res.redirect("/profile/lawyer/new");
      } else if (user.role == "Client") {
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
  res.redirect("/");
});

router.get("/dashboard", function (req, res) {
  if (req.user.role == "Lawyer") {
    Client.find({}, function (err, cli) {
      if (err) {
        console.log(err.message);
        res.redirect("/");
      } else {
        Lawyer.findOne({ _id: req.user.roleId })
          .populate("cases")
          .populate("appointments")
          .populate("invoices")
          .exec(function (err, law) {
            if (err) {
              console.log(err.message);
              res.redirect("/");
            } else {
              console.log(law);
              res.render("dashboard", { info: law, cli: cli });
            }
          });
      }
    });
  } else {
    Lawyer.find({}, function (err, law) {
      if (err) {
        console.log(err.message);
        res.redirect("/");
      } else {
        Client.findOne({ _id: req.user.roleId })
          .populate("cases")
          .populate("appointments")
          .populate("invoices")
          .exec(function (err, cli) {
            if (err) {
              console.log(err.message);
              res.redirect("/");
            } else {
              console.log(cli);
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
