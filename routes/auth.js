const express = require("express");
const authController = require("../controllers/auth");
const { signUpValidator, loginValidator } = require("../middlewares/validators/auth");
const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", loginValidator, authController.postLogin);

router.get("/signup", authController.getSignup);
router.post("/signup", signUpValidator, authController.postSignup);

router.post("/logout", authController.postLogout);

router.get("/reset-password", authController.getReset);
router.post("/reset-password", authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
