const { validationResult } = require("express-validator");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: "",
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
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
        imageUrl,
        price,
        description,
      },
    });
  }

  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: req.user, //mongoose auto extracts id
  });
  product
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch((err) => next(new Error(err)));
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
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
      },
    });
  }

  const product = await Product.findById(id);

  if (product.userId.toString() !== req.user._id.toString()) {
    return res.redirect("/");
  }

  product.title = req.body.title;
  product.imageUrl = req.body.imageUrl;
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

exports.postDeleteProduct = (req, res) => {
  Product.deleteOne({ _id: req.body.productId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      next(new Error(err));
    });
};
