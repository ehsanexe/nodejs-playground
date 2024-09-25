const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host:  process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

exports.getLogin = (req, res, next) => {
  const msg = req.flash("error");
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: msg.length > 0 ? msg[0] : "",
  });
};

exports.getSignup = (req, res, next) => {
  const msg = req.flash("error");
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: msg.length > 0 ? msg[0] : "",
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 12);
    const email = req.body.email;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      req.flash("error", "email already registered!");
      return res.redirect("/signup");
    }

    const user = new User({
      email: req.body.email,
      password: hashPassword,
      cart: { items: [] },
    });
    await user.save();
    res.redirect("/login");
    transport.sendMail({
      from: '"Shop" <shop@mart.com>', // sender address
      to: email, // list of receivers
      subject: "Welcome to Our Shop", // Subject line
      html: "<p>We’re excited to have you on board. Your account has been successfully created.</p>", // plain text body
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "invalid email!");
      return res.redirect("/login");
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      req.flash("error", "invalid password!");
      return res.redirect("/login");
    }

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
