const { body, check, } = require("express-validator");

exports.productValidator = [
  body("title").isString().trim().isLength({ min: 2, max: 20 }),
  body("price").isNumeric(),
  body("description").isString().trim().isLength({ min: 2, max: 200 }),
];
