const { body } = require("express-validator");
const User = require("../../models/user");
const bcrypt = require("bcrypt");

exports.signUpValidator = [
  body("email").isEmail().normalizeEmail().trim().withMessage("Invalid email"),
  body("email")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error("E-mail already registered");
      }
    })
    .withMessage("E-mail already registered"),
  body("password")
    .isLength({ min: 4, max: 20 })
    .withMessage("Password length should be of length 4"),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Password and Confirm Password fields does not match"),
];

exports.loginValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("email")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });

      if (!user) {
        throw new Error("error", "invalid email!");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error("error", "invalid password!");
      }
      req.user = user;
    })
    .withMessage("Invalid email or password"),
];
