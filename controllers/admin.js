const { validationResult } = require("express-validator");
const Product = require("../models/product");
const fs = require("fs");
const stripe = require("stripe")(process.env.STRIPE);

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: "",
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        errorMessage: result.array()[0].msg,
        product: {
          title,
          imageUrl: image.path,
          price,
          description,
        },
      });
    }
    const stripeProduct = await stripe.products.create({
      name: title,
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: price * 100, // unit amount is in cents
      currency: "usd",
    });

    const product = new Product({
      title,
      price,
      imageUrl: image.path,
      description,
      userId: req.user, //mongoose auto extracts id
      stripePriceId: stripePrice.id,
    });
    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    throw error;
  }
};

exports.postEditProduct = async (req, res, next) => {
  const id = req.body.productId;

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: true,
      errorMessage: result.array()[0].msg,
      product: {
        _id: id,
        title: req.body.title,
        imageUrl: req.file.path,
        price: req.body.price,
        description: req.body.description,
      },
    });
  }

  const product = await Product.findById(id);

  if (product.userId.toString() !== req.user._id.toString()) {
    return res.redirect("/");
  }

  fs.unlink(product.imageUrl, async (err) => {
    if (err) throw err;
  });

  product.title = req.body.title;
  product.imageUrl = req.file.path;
  product.price = req.body.price;
  product.description = req.body.description;

  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => next(new Error(err)));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const productId = req.params.product_id;
  if (!editMode) {
    return res.redirect("/");
  }

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
        errorMessage: "",
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);
    fs.unlink(product.imageUrl, async (err) => {
      if (err) throw err;
      await product.deleteOne();
      res.redirect("/admin/products");
    });
  } catch (error) {
    next(new Error(error));
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    fs.unlink(product.imageUrl, async (err) => {
      if (err) throw err;
      await product.deleteOne();
      res
        .status(200)
        .json({ message: "Item deleted successfully", status: 200 });
    });
  } catch (error) {
    res.status(500).json({ message: error, status: 500 });
  }
};
