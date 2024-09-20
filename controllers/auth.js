const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findById("66ea78393ad7221c3ead5ac8");

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postLogout = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
