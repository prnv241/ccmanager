var express = require("express");
var router = express.Router();
var Client = require("../models/client");
var Lawyer = require("../models/lawyer");
var Case = require("../models/case");
var MiddleFun = require("../middlewares/authwares");

router.put("/cases/:caseid", MiddleFun.isLoggedIn, function (req, res) {
  var ID = req.params.caseid;
  Case.findByIdAndUpdate(ID, req.body.rec, function (err, casee) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/cases");
    } else {
      req.flash("success", "Edited Successfully!");
      res.redirect("/cases");
    }
  });
});

router.delete("/cases/:caseid", MiddleFun.isLoggedIn, function (req, res) {
  var ID = req.params.caseid;
  Case.findByIdAndDelete(ID, function (err, casee) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/cases");
    } else {
      req.flash("success", "Deleted Successfully!");
      res.redirect("/cases");
    }
  });
});

router.get("/cases/:caseid/show", MiddleFun.isLoggedIn, function (req, res) {
  var ID = req.params.caseid;
  Case.findById(ID, function (err, casee) {
    if (err) {
      console.log(err);
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      res.render("case/show", { casee: casee });
    }
  });
});

router.get("/cases/:caseid/edit", MiddleFun.isLoggedIn, function (req, res) {
  var ID = req.params.caseid;
  Case.findById(ID, function (err, casee) {
    if (err) {
      console.log(err);
      res.redirect("/");
      req.flash("error", "Something went Wrong!");
    } else {
      res.render("case/edit", { casee: casee });
    }
  });
});

router.get("/cases/new", MiddleFun.isLoggedIn, function (req, res) {
  res.render("case/new");
});

router.post("/cases", MiddleFun.isLoggedIn, function (req, res) {
  if (req.user.role == "Lawyer") {
    Lawyer.findById(req.user.roleId, function (err, law) {
      if (err) {
        console.log(err.message);
        req.flash("error", "Something went Wrong!");
        res.redirect("/cases");
      } else {
        Case.create(req.body.rec, function (err, casee) {
          if (err) {
            console.log(err);
            req.flash("error", "Something went Wrong!");
            res.redirect("/");
          } else {
            law.cases.push(casee._id);
            law.save();
            casee.authid = req.user._id;
            casee.save();
            req.flash("success", "Added Successfully!");
            res.redirect("/cases");
          }
        });
      }
    });
  } else if ((req.user.role = "Client")) {
    Client.findById(req.user.roleId, function (err, cli) {
      if (err) {
        console.log(err.message);
        req.flash("error", "Something went Wrong!");
        res.redirect("/cases");
      } else {
        Case.create(req.body.rec, function (err, casee) {
          if (err) {
            console.log(err);
            req.flash("error", "Something went Wrong!");
            res.redirect("/");
          } else {
            cli.cases.push(casee._id);
            cli.save();
            casee.authid = req.user._id;
            casee.save();
            req.flash("success", "Added Successfully!");
            res.redirect("/cases");
          }
        });
      }
    });
  }
});

router.get("/cases", MiddleFun.isLoggedIn, function (req, res) {
  Case.find({ authid: req.user._id }, function (err, cases) {
    if (err) {
      console.log(err);
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      res.render("case/cases", { cases: cases });
    }
  });
});

module.exports = router;
