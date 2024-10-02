const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const transport = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: "",
    values: {
      email: "",
      password: "",
    },
  });
};

exports.getSignup = (req, res, next) => {
  const msg = req.flash("error");
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: msg.length > 0 ? msg[0] : "",
    values: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
};

exports.postSignup = async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 12);
    const email = req.body.email;

    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        errorMessage: result.array()[0].msg,
        values: {
          email,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
        },
      });
      return;
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
    next(new Error(error));
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: result.array()[0].msg,
        values: {
          email: req.body.email,
          password: req.body.password,
        },
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = req.user;
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (error) {
    next(new Error(error));
  }
};

exports.postLogout = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  const msg = req.flash("error");
  res.render("auth/reset", {
    path: "/reset-password",
    pageTitle: "Reset Password",
    errorMessage: msg.length > 0 ? msg[0] : "",
  });
};

exports.postReset = (req, res, next) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) throw err;

      const token = buffer.toString("hex");
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        req.flash("error", "No account with that email found.");
        return res.redirect("/reset");
      }

      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 1000 * 60 * 60; // 1000 * 60 * 60 =  1hr

      await user.save();

      transport.sendMail({
        from: '"Shop" <shop@mart.com>', // sender address
        to: email, // list of receivers
        subject: "Reset Password", // Subject line
        html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:${process.env.DEV_PORT}/reset/${token}">link</a> to set a new password.</p>
              `,
      });
      res.redirect("/");
    });
  } catch (error) {
    next(new Error(error));
  }
};

exports.getNewPassword = async (req, res, next) => {
  try {
    const msg = req.flash("error");
    const token = req.params.token;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      errorMessage: msg.length > 0 ? msg[0] : "",
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (error) {
    next(new Error(error));
  }
};

exports.postNewPassword = async (req, res, next) => {
  try {
    const { userId, passwordToken, password } = req.body;

    const user = await User.findOne({
      _id: userId,
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect("/login");
  } catch (error) {
    next(new Error(error));
  }
};
