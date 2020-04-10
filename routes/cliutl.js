var express = require("express");
var router = express.Router();
var Client = require("../models/client");
var Lawyer = require("../models/lawyer");
var Appointment = require("../models/appointment");
router.get("/lawyers", function (req, res) {
  Lawyer.find({}, function (err, lawyers) {
    if (err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("lawyer/index", { lawyers: lawyers });
    }
  });
});

router.get("/lawyers/:id", function (req, res) {
  var ID = req.params.id;
  Lawyer.findById(ID, function (err, law) {
    if (err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("lawyer/show", { law: law });
    }
  });
});

router.get("/appointments/:lid/new", function (req, res) {
  Lawyer.findById(req.params.lid, function (err, law) {
    if (err) {
      console.log(err.message);
      res.redirect("/dashboard");
    } else {
      res.render("appointment/new", { law: law });
    }
  });
});

router.post("/appointments/:lid", function (req, res) {
  cid = req.user.roleId;
  Client.findById(cid, function (err, cli) {
    if (err) {
      console.log(err.message);
      res.redirect("/appointments");
    } else {
      Lawyer.findById(req.params.lid, function (err, law) {
        if (err) {
          console.log(err.message);
          res.redirect("/appointments");
        } else {
          Appointment.create(req.body.appt, function (err, apt) {
            if (err) {
              console.log(err.message);
              res.redirect("/appointments");
            } else {
              apt.author = req.user._id;
              apt.cname = cli.name;
              apt.save();
              law.appointments.push(apt._id);
              cli.appointments.push(apt._id);
              law.save();
              cli.save();
              res.redirect("/appointments");
            }
          });
        }
      });
    }
  });
});

router.get("/appointments", function (req, res) {
  if (req.user.role == "Lawyer") {
    Lawyer.findOne({ _id: req.user.roleId })
      .populate("appointments")
      .exec(function (err, apts) {
        if (err) {
          console.log(err.message);
          res.redirect("/dashboard");
        } else {
          res.render("appointment/index", { apts: apts });
        }
      });
  } else {
    Client.findOne({ _id: req.user.roleId })
      .populate("appointments")
      .exec(function (err, apts) {
        if (err) {
          console.log(err.message);
          res.redirect("/dashboard");
        } else {
          res.render("appointment/index", { apts: apts });
        }
      });
  }
});

router.delete("/appointments/:aid", function (req, res) {
  Appointment.findByIdAndDelete(req.params.aid, function (err, apt) {
    if (err) {
      console.log(err.message);
      res.redirect("/dashboard");
    } else {
      res.redirect("/appointments");
    }
  });
});

module.exports = router;
