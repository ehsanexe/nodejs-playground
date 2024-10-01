const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const { isAuth } = require("../middlewares/auth");
const { productValidator } = require("../middlewares/validators/admin");

const router = express.Router();

router.use(isAuth);

router.get("/add-product", adminController.getAddProduct);

router.get("/edit-product/:product_id", adminController.getEditProduct);
router.post("/edit-product", productValidator, adminController.postEditProduct);

router.get("/products", adminController.getProducts);

router.post("/add-product", productValidator, adminController.postAddProduct);

router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
