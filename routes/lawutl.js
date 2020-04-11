var express = require("express");
var router = express.Router();
var Client = require("../models/client");
var Lawyer = require("../models/lawyer");
var Invoice = require("../models/invoice");
var MiddleFun = require("../middlewares/authwares");

router.get("/clients", MiddleFun.isLoggedLawyer, function (req, res) {
  Client.find({}, function (err, clients) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      res.render("client/index", { clients: clients });
    }
  });
});

router.get("/clients/:id", MiddleFun.isLoggedLawyer, function (req, res) {
  var ID = req.params.id;
  Client.findById(ID, function (err, cli) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/");
    } else {
      res.render("client/show", { cli: cli });
    }
  });
});

router.get("/invoices/:cid/new", MiddleFun.isLoggedLawyer, function (req, res) {
  Client.findById(req.params.cid, function (err, cli) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/dashboard");
    } else {
      res.render("invoice/new", { cli: cli });
    }
  });
});

router.post("/invoices/:cid", MiddleFun.isLoggedLawyer, function (req, res) {
  lid = req.user.roleId;
  Lawyer.findById(lid, function (err, law) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/invoices");
    } else {
      Client.findById(req.params.cid, function (err, cli) {
        if (err) {
          console.log(err.message);
          req.flash("error", "Something went Wrong!");
          res.redirect("/invoices");
        } else {
          Invoice.create(req.body.inv, function (err, invi) {
            if (err) {
              console.log(err.message);
              req.flash("error", "Something went Wrong!");
              res.redirect("/invoices");
            } else {
              invi.author = req.user._id;
              invi.lname = law.name;
              invi.save();
              law.invoices.push(invi._id);
              cli.invoices.push(invi._id);
              law.save();
              cli.save();
              req.flash("success", "Invoice Added!");
              res.redirect("/invoices");
            }
          });
        }
      });
    }
  });
});

router.get("/invoices", MiddleFun.isLoggedIn, function (req, res) {
  if (req.user.role == "Lawyer") {
    Lawyer.findOne({ _id: req.user.roleId })
      .populate("invoices")
      .exec(function (err, apts) {
        if (err) {
          console.log(err.message);
          req.flash("error", "Something went Wrong!");
          res.redirect("/dashboard");
        } else {
          res.render("invoice/index", { invs: apts });
        }
      });
  } else {
    Client.findOne({ _id: req.user.roleId })
      .populate("invoices")
      .exec(function (err, apts) {
        if (err) {
          console.log(err.message);
          req.flash("error", "Something went Wrong!");
          res.redirect("/dashboard");
        } else {
          res.render("invoice/index", { invs: apts });
        }
      });
  }
});

router.delete("/invoices/:iid", MiddleFun.isLoggedIn, function (req, res) {
  Invoice.findByIdAndDelete(req.params.iid, function (err, inv) {
    if (err) {
      console.log(err.message);
      req.flash("error", "Something went Wrong!");
      res.redirect("/dashboard");
    } else {
      req.flash("error", "Deleted Successfullt!");
      res.redirect("/invoices");
    }
  });
});

module.exports = router;
