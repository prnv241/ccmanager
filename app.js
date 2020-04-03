var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var User = require("./models/user");
var Client = require("./models/client");
var Lawyer = require("./models/lawyer");
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
    saveUninitialized: false
  })
);

mongoose.connect("mongodb+srv://global:pranav@cluster0-noe9k.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser:true}).then(() => {
	console.log("Connected");	
}).catch(err => {
	console.log("ERROR:", err.message);
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/login", function(req,res) {
  res.render("login");
});

app.get("/signup", function(req,res) {
  res.render("signup");
});

app.post("/signup", function(req,res) {
  var newUser = new User({username: req.body.username, role: req.body.role});
  User.register(newUser, req.body.password, function(err,user) {
    if(err) {
      return res.redirect("/signup");
    }
    passport.authenticate("local")(req,res,function(){
      if(user.role == "Lawyer") {
        res.redirect("/profile/lawyer/new");
      }
      else if(user.role == "Client") {
        res.redirect("/profile/client/new");
      }
    });
  });
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login"
}), function(req,res) { });

app.get("/logout", function(req,res) {
  req.logOut();
  res.redirect("/");
})

app.get("/dashboard", function(req,res) {
  res.render("dashboard");
});

app.get("/profile/lawyer/new", function(req,res) {
  res.render("profile/newLawyer");
});

app.get("/profile/client/new", function(req,res) {
  res.render("profile/newClient");
});

app.post("/profile/lawyer", function(req,res){
  Lawyer.create(req.body.prof, function(err,law) {
    if(err) {
      res.redirect("/");
    } else {
      User.findByIdAndUpdate(req.user._id, {roleId: law._id}, function(err,user) {
        if(err){
          res.redirect("/");
        }else {
          res.redirect("/dashboard");
        }
      });
    }
  });
});

app.post("/profile/client", function(req,res) {
  Client.create(req.body.prof, function(err,cli) {
    if(err) {
      res.redirect("/");
    } else {
      User.findByIdAndUpdate(req.user._id, {roleId: cli._id}, function(err,user) {
        if(err){
          res.redirect("/");
        }else {
          res.redirect("/dashboard");
        }
      });
    }
  });
});

app.get("/profile/client/:id", function(req,res) {
  var ID = req.params.id;
  Client.findById(ID,function(err,cli) {
    if(err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("profile/Client", {cli: cli});
    }
  });
});

app.get("/profile/lawyer/:id", function(req,res) {
  var ID = req.params.id;
  Lawyer.findById(ID,function(err,law) {
    if(err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("profile/Lawyer", {law: law});
    }
  });
});

app.get("/profile/client/:id/edit", function(req,res){
  var ID = req.params.id;
  Client.findById(ID,function(err,cli) {
    if(err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("profile/editClient", {cli: cli});
    }
  });
});

app.get("/profile/lawyer/:id/edit", function(req,res){
  var ID = req.params.id;
  Lawyer.findById(ID,function(err,law) {
    if(err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("profile/editLawyer", {law: law});
    }
  });
})

app.put("/profile/client/:id", function(req,res){
  var ID = req.params.id;
  Client.findByIdAndUpdate(ID,req.body.prof,function(err,cli) {
    if(err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.redirect("/profile/client/" + ID);
    }
  });
});

app.put("/profile/lawyer/:id", function(req,res){
  var ID = req.params.id;
  Lawyer.findByIdAndUpdate(ID,req.body.prof,function(err,law) {
    if(err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.redirect("/profile/lawyer/" + ID);
    }
  });
})

app.get("/cases/:id/new", function(req,res) {
  res.render("case/new");
});

app.post("/cases/:id" , function(req,res) {
  Case.create(req.body.rec, function(err,casee) {
    if(err) {
      console.log(err);
      res.redirect("/");
    } else {
      casee.authid = req.params.id;
      casee.save();
      res.redirect("/cases/" + req.params.id);
    }
  });
});

app.get("/cases/:id", function(req,res) {
  Case.find({authid: req.params.id}, function(err,cases) {
    if(err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("case/cases", {cases:cases});
    }
  });
});

app.get("/cases/:id/:caseid", function(req,res) {
  var ID = req.params.caseid;
  Case.findById(ID, function(err,casee) {
    if(err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("case/show", {casee:casee});
    }
  });
});

app.get("/cases/:id/:caseid/edit", function(req,res) {
  var ID = req.params.caseid;
  Case.findById(ID, function(err,casee) {
    if(err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("case/edit", {casee:casee});
    }
  });
});

app.put("/cases/:id/:caseid", function(req,res) {
  var ID = req.params.caseid;
  Case.findByIdAndUpdate(ID, req.body.rec, function(err,casee) {
    if(err) {
      console.log(err.message);
    }
    res.redirect("/cases/" + req.params.id);
  }); 
});

app.delete("/cases/:id/:caseid", function(req,res) {
  var ID = req.params.caseid;
  Case.findByIdAndDelete(ID, function(err,casee) {
    if(err) {
      console.log(err.message);
    }
    res.redirect("/cases/" + req.params.id);
  })
});

app.get("/lawyers", function(req,res) {
  Lawyer.find({}, function(err,lawyers) {
    if(err) {
      console.log(err.message);
      res.redirect("/");
    } else {
      res.render("lawyer/index", {lawyers: lawyers});
    }
  })
});

const PORT = 3000;
const HOSTNAME = "127.0.0.1";

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});

