const express = require("express");
const { getLogin } = require("../controllers/login");
const router = express.Router();

router.get("/login", getLogin);

module.exports = router;
