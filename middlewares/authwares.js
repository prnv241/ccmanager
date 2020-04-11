var middleObj = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
  },
  isLoggedLawyer: function (req, res, next) {
    if (req.isAuthenticated()) {
      if ((req.user.role = "Lawyer")) {
        return next();
      }
    }
    req.flash("error", "You must be on a lawyer account to do that!");
    res.redirect("/login");
  },
  isLoggedClient: function (req, res, next) {
    if (req.isAuthenticated()) {
      if ((req.user.role = "Client")) {
        return next();
      }
    }
    req.flash("error", "You must be on a client account to do that!");
    res.redirect("/login");
  },
};

module.exports = middleObj;
