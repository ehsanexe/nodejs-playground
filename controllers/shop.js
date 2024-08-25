const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.product_id;
  Product.findById(id, (p) => {
    res.render("shop/product-detail", {
      product: p,
      pageTitle: p.title,
      path: "/products",
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.fetchAll((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];

      cart.products.forEach((cp) => {
        const prod = products.find((pr) => pr.id === cp.productId);
        prod && cartProducts.push({ productData: prod, qty: cp.qty });
      });

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addToCart(productId, product.price);
  });
  res.redirect("/");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.deleteById(productId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
