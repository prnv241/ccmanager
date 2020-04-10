var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Client = require("../models/client");
var Lawyer = require("../models/lawyer");

router.get("/profile/lawyer/new", function (req, res) {
  res.render("profile/newLawyer");
});

router.get("/profile/client/new", function (req, res) {
  res.render("profile/newClient");
});

router.post("/profile/lawyer", function (req, res) {
  Lawyer.create(req.body.prof, function (err, law) {
    if (err) {
      res.redirect("/");
    } else {
      User.findByIdAndUpdate(req.user._id, { roleId: law._id }, function (
        err,
        user
      ) {
        if (err) {
          res.redirect("/");
        } else {
          res.redirect("/dashboard");
        }
      });
    }
  });
});

router.post("/profile/client", function (req, res) {
  Client.create(req.body.prof, function (err, cli) {
    if (err) {
      res.redirect("/");
    } else {
      User.findByIdAndUpdate(req.user._id, { roleId: cli._id }, function (
        err,
        user
      ) {
        if (err) {
          res.redirect("/");
        } else {
          res.redirect("/dashboard");
        }
      });
    }
  });
});

router.get("/profile/client/:id", function (req, res) {
  var ID = req.params.id;
  Client.findById(ID, function (err, cli) {
    if (err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("profile/Client", { cli: cli });
    }
  });
});

router.get("/profile/lawyer/:id", function (req, res) {
  var ID = req.params.id;
  Lawyer.findById(ID, function (err, law) {
    if (err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("profile/Lawyer", { law: law });
    }
  });
});

router.get("/profile/client/:id/edit", function (req, res) {
  var ID = req.params.id;
  Client.findById(ID, function (err, cli) {
    if (err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("profile/editClient", { cli: cli });
    }
  });
});

router.get("/profile/lawyer/:id/edit", function (req, res) {
  var ID = req.params.id;
  Lawyer.findById(ID, function (err, law) {
    if (err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("profile/editLawyer", { law: law });
    }
  });
});

router.put("/profile/client/:id", function (req, res) {
  var ID = req.params.id;
  Client.findByIdAndUpdate(ID, req.body.prof, function (err, cli) {
    if (err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.redirect("/profile/client/" + ID);
    }
  });
});

router.put("/profile/lawyer/:id", function (req, res) {
  var ID = req.params.id;
  Lawyer.findByIdAndUpdate(ID, req.body.prof, function (err, law) {
    if (err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.redirect("/profile/lawyer/" + ID);
    }
  });
});

module.exports = router;
