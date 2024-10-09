const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const stripe = require("stripe")(process.env.STRIPE);

exports.getProducts = async (req, res, next) => {
  const pageNo = req.query.pageNo ? parseInt(req.query.pageNo) : 1;
  const totleRecords = await Product.countDocuments();
  const skip = process.env.PAGE_SIZE * pageNo - process.env.PAGE_SIZE;
  const limit = process.env.PAGE_SIZE;
  const totalPages = Math.ceil(totleRecords / process.env.PAGE_SIZE);

  Product.find()
    .skip(skip)
    .limit(limit)
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        pageNo,
        totalPages,
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.getProduct = (req, res, next) => {
  const id = req.params.product_id;
  Product.findById(id)
    .then((p) => {
      res.render("shop/product-detail", {
        product: p,
        pageTitle: p.title,
        path: "/products",
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.getIndex = async (req, res, next) => {
  const pageNo = req.query.pageNo ? parseInt(req.query.pageNo) : 1;
  const totleRecords = await Product.countDocuments();
  const skip = process.env.PAGE_SIZE * pageNo - process.env.PAGE_SIZE;
  const limit = process.env.PAGE_SIZE;
  const totalPages = Math.ceil(totleRecords / process.env.PAGE_SIZE);

  Product.find()
    .skip(skip)
    .limit(limit)
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        pageNo,
        totalPages,
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products,
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.postCart = async (req, res, next) => {
  const productId = req.body.productId;

  try {
    const product = await Product.findById(productId);
    await req.user.addToCart(product);
    res.redirect("/cart");
  } catch (error) {
    next(new Error(err));
  }
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .deleteItemFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => {
      next(new Error(err));
    });
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    const products = user.cart.items.map((i) => ({
      product: i.productId.toJSON(),
      qty: i.qty,
    }));

    const order = new Order({
      user: {
        name: req.user.id,
        userId: req.user, //mongoos auto extracts id
      },
      products: products,
    });

    await order.save();
    await req.user.clearCart();
    res.redirect("/orders");
  } catch (error) {
    next(new Error(err));
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (order.user.userId.toString() !== req.user._id.toString()) {
      throw new Error("Authorization failed");
    }

    const doc = new PDFDocument();
    doc.pipe(res);
    doc.fontSize(25).text("Invoice");
    doc.fontSize(25).text("-----------");

    let totalPrice = 0;
    order.products.forEach((item) => {
      totalPrice += item.product.price * item.qty;
      doc
        .fontSize(12)
        .text(
          `- ${item.product.title} x ${item.qty} $ ${
            item.product.price * item.qty
          }`
        );
    });

    doc.fontSize(12).text("------------------------");
    doc.fontSize(12).text(`Total Price: $${totalPrice}`);

    doc.end();
  } catch (error) {
    throw error;
  }
};

exports.postCheckout = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.items.productId");
    let products = user.cart.items.map((i) => ({
      product: i.productId.toJSON(),
      qty: i.qty,
    }));
    const host = req.get("host"); // Gets the host (domain + port)
    const protocol = req.protocol; // Gets the protocol (http or https)
    const domain = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      line_items: products.map((item) => ({
        price: item.product.stripePriceId,
        quantity: item.qty,
      })),
      mode: "payment",
      success_url: `${domain}/success`,
      cancel_url: `${domain}/checkout`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    throw error;
  }
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
