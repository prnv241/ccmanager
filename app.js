var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var User = require("./models/user");
var Client = require("./models/client");
var Lawyer = require("./models/lawyer");
var Invoice = require("./models/invoice");
var Appointment = require("./models/appointment");
var Case = require("./models/case");
var passport = require("passport");
var LocalStrategy = require("passport-local");

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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.post("/signup", function (req, res) {
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

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

app.get("/dashboard", function (req, res) {
  res.render("dashboard");
});

app.get("/profile/lawyer/new", function (req, res) {
  res.render("profile/newLawyer");
});

app.get("/profile/client/new", function (req, res) {
  res.render("profile/newClient");
});

app.post("/profile/lawyer", function (req, res) {
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

app.post("/profile/client", function (req, res) {
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

app.get("/profile/client/:id", function (req, res) {
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

app.get("/profile/lawyer/:id", function (req, res) {
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

app.get("/profile/client/:id/edit", function (req, res) {
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

app.get("/profile/lawyer/:id/edit", function (req, res) {
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

app.put("/profile/client/:id", function (req, res) {
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

app.put("/profile/lawyer/:id", function (req, res) {
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

app.put("/cases/:caseid", function (req, res) {
  var ID = req.params.caseid;
  Case.findByIdAndUpdate(ID, req.body.rec, function (err, casee) {
    if (err) {
      console.log(err.message);
    }
    res.redirect("/cases");
  });
});

app.delete("/cases/:caseid", function (req, res) {
  var ID = req.params.caseid;
  Case.findByIdAndDelete(ID, function (err, casee) {
    if (err) {
      console.log(err.message);
    }
    res.redirect("/cases");
  });
});

app.get("/cases/:caseid/show", function (req, res) {
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

app.get("/cases/:caseid/edit", function (req, res) {
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

app.get("/cases/new", function (req, res) {
  res.render("case/new");
});

app.post("/cases", function (req, res) {
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

app.get("/cases", function (req, res) {
  Case.find({ authid: req.user._id }, function (err, cases) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("case/cases", { cases: cases });
    }
  });
});

app.get("/lawyers", function (req, res) {
  Lawyer.find({}, function (err, lawyers) {
    if (err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("lawyer/index", { lawyers: lawyers });
    }
  });
});

app.get("/lawyers/:id", function (req, res) {
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

app.get("/appointments/:lid/new", function (req, res) {
  Lawyer.findById(req.params.lid, function (err, law) {
    if (err) {
      console.log(err.message);
      res.redirect("/dashboard");
    } else {
      res.render("appointment/new", { law: law });
    }
  });
});

app.post("/appointments/:lid", function (req, res) {
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

app.get("/appointments", function (req, res) {
  Appointment.find({ author: req.user._id }, function (err, apts) {
    if (err) {
      console.log(err.message);
      res.redirect("/dashboard");
    } else {
      res.render("appointment/index", { apts: apts });
    }
  });
});

app.delete("/appointments/:aid", function (req, res) {
  Appointment.findByIdAndDelete(req.params.aid, function (err, apt) {
    if (err) {
      console.log(err.message);
      res.redirect("/dashboard");
    } else {
      res.redirect("/appointments");
    }
  });
});

app.get("/clients", function (req, res) {
  Client.find({}, function (err, clients) {
    if (err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("client/index", { clients: clients });
    }
  });
});

app.get("/clients/:id", function (req, res) {
  var ID = req.params.id;
  Client.findById(ID, function (err, cli) {
    if (err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("client/show", { cli: cli });
    }
  });
});

app.get("/invoices/:cid/new", function (req, res) {
  Client.findById(req.params.cid, function (err, cli) {
    if (err) {
      console.log(err.message);
      res.redirect("/dashboard");
    } else {
      res.render("invoice/new", { cli: cli });
    }
  });
});

app.post("/invoices/:cid", function (req, res) {
  lid = req.user.roleId;
  Lawyer.findById(lid, function (err, law) {
    if (err) {
      console.log(err.message);
      res.redirect("/invoices");
    } else {
      Client.findById(req.params.cid, function (err, cli) {
        if (err) {
          console.log(err.message);
          res.redirect("/invoices");
        } else {
          Invoice.create(req.body.inv, function (err, invi) {
            if (err) {
              console.log(err.message);
              res.redirect("/invoices");
            } else {
              invi.author = req.user._id;
              invi.lname = law.name;
              invi.save();
              law.invoices.push(invi._id);
              cli.invoices.push(invi._id);
              law.save();
              cli.save();
              res.redirect("/invoices");
            }
          });
        }
      });
    }
  });
});

app.get("/invoices", function (req, res) {
  Invoice.find({ author: req.user._id }, function (err, invs) {
    if (err) {
      console.log(err.message);
      res.redirect("/dashboard");
    } else {
      res.render("invoice/index", { invs: invs });
    }
  });
});

app.delete("/invoices/:iid", function (req, res) {
  Invoice.findByIdAndDelete(req.params.iid, function (err, inv) {
    if (err) {
      console.log(err.message);
      res.redirect("/dashboard");
    } else {
      res.redirect("/invoices");
    }
  });
});

const PORT = 3000;
const HOSTNAME = "127.0.0.1";

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
