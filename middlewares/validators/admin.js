const { body } = require("express-validator");

exports.productValidator = [
  body("title").isString().trim().isLength({min: 2, max: 20 }),
  body("imageUrl").isURL(),
  body("price").isNumeric(),
  body("description").isString().trim().isLength({min: 2, max: 200 }),
];
