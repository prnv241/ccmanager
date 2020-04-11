var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Client = require("../models/client");
var Lawyer = require("../models/lawyer");
var MiddleFun = require("../middlewares/authwares");

router.get("/profile/lawyer/new", MiddleFun.isLoggedIn, function (req, res) {
  res.render("profile/newLawyer");
});

router.get("/profile/client/new", MiddleFun.isLoggedIn, function (req, res) {
  res.render("profile/newClient");
});

router.post("/profile/lawyer", MiddleFun.isLoggedIn, function (req, res) {
  Lawyer.create(req.body.prof, function (err, law) {
    if (err) {
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      User.findByIdAndUpdate(req.user._id, { roleId: law._id }, function (
        err,
        user
      ) {
        if (err) {
          req.flash("error", "Something went Wrong!");
          res.redirect("/");
        } else {
          req.flash("success", "Welcome onboard " + req.user.username);
          res.redirect("/dashboard");
        }
      });
    }
  });
});

router.post("/profile/client", MiddleFun.isLoggedIn, function (req, res) {
  Client.create(req.body.prof, function (err, cli) {
    if (err) {
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      User.findByIdAndUpdate(req.user._id, { roleId: cli._id }, function (
        err,
        user
      ) {
        if (err) {
          req.flash("error", "Something went Wrong!");
          res.redirect("/");
        } else {
          req.flash("success", "Welcome onboard " + req.user.username);
          res.redirect("/dashboard");
        }
      });
    }
  });
});

router.get("/profile/client/:id", MiddleFun.isLoggedIn, function (req, res) {
  var ID = req.params.id;
  Client.findById(ID, function (err, cli) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      res.render("profile/Client", { cli: cli });
    }
  });
});

router.get("/profile/lawyer/:id", MiddleFun.isLoggedIn, function (req, res) {
  var ID = req.params.id;
  Lawyer.findById(ID, function (err, law) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      res.render("profile/Lawyer", { law: law });
    }
  });
});

router.get("/profile/client/:id/edit", MiddleFun.isLoggedIn, function (
  req,
  res
) {
  var ID = req.params.id;
  Client.findById(ID, function (err, cli) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      res.render("profile/editClient", { cli: cli });
    }
  });
});

router.get("/profile/lawyer/:id/edit", MiddleFun.isLoggedIn, function (
  req,
  res
) {
  var ID = req.params.id;
  Lawyer.findById(ID, function (err, law) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      res.render("profile/editLawyer", { law: law });
    }
  });
});

router.put("/profile/client/:id", MiddleFun.isLoggedIn, function (req, res) {
  var ID = req.params.id;
  Client.findByIdAndUpdate(ID, req.body.prof, function (err, cli) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      req.flash("success", "Edited Successfully!");
      res.redirect("/profile/client/" + ID);
    }
  });
});

router.put("/profile/lawyer/:id", MiddleFun.isLoggedIn, function (req, res) {
  var ID = req.params.id;
  Lawyer.findByIdAndUpdate(ID, req.body.prof, function (err, law) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      req.flash("success", "Edited Successfully!");
      res.redirect("/profile/lawyer/" + ID);
    }
  });
});

module.exports = router;
