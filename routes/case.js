var express = require("express");
var router = express.Router();
var Client = require("../models/client");
var Lawyer = require("../models/lawyer");
var Case = require("../models/case");

router.put("/cases/:caseid", function (req, res) {
  var ID = req.params.caseid;
  Case.findByIdAndUpdate(ID, req.body.rec, function (err, casee) {
    if (err) {
      console.log(err.message);
    }
    res.redirect("/cases");
  });
});

router.delete("/cases/:caseid", function (req, res) {
  var ID = req.params.caseid;
  Case.findByIdAndDelete(ID, function (err, casee) {
    if (err) {
      console.log(err.message);
    }
    res.redirect("/cases");
  });
});

router.get("/cases/:caseid/show", function (req, res) {
  var ID = req.params.caseid;
  Case.findById(ID, function (err, casee) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("case/show", { casee: casee });
    }
  });
});

router.get("/cases/:caseid/edit", function (req, res) {
  var ID = req.params.caseid;
  Case.findById(ID, function (err, casee) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("case/edit", { casee: casee });
    }
  });
});

router.get("/cases/new", function (req, res) {
  res.render("case/new");
});

router.post("/cases", function (req, res) {
  if (req.user.role == "Lawyer") {
    Lawyer.findById(req.user.roleId, function (err, law) {
      if (err) {
        console.log(err.message);
        res.redirect("/cases");
      } else {
        Case.create(req.body.rec, function (err, casee) {
          if (err) {
            console.log(err);
            res.redirect("/");
          } else {
            law.cases.push(casee._id);
            law.save();
            casee.authid = req.user._id;
            casee.save();
            res.redirect("/cases");
          }
        });
      }
    });
  } else if ((req.user.role = "Client")) {
    Client.findById(req.user.roleId, function (err, cli) {
      if (err) {
        console.log(err.message);
        res.redirect("/cases");
      } else {
        Case.create(req.body.rec, function (err, casee) {
          if (err) {
            console.log(err);
            res.redirect("/");
          } else {
            cli.cases.push(casee._id);
            cli.save();
            casee.authid = req.user._id;
            casee.save();
            res.redirect("/cases");
          }
        });
      }
    });
  }
});

router.get("/cases", function (req, res) {
  Case.find({ authid: req.user._id }, function (err, cases) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("case/cases", { cases: cases });
    }
  });
});

module.exports = router;
