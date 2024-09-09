const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
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
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.getCart = (req, res, next) => {
//   req.user
//     .getCart()
//     .then((cart) => {
//       cart
//         .getProducts()
//         .then((products) => {
//           res.render("shop/cart", {
//             path: "/cart",
//             pageTitle: "Your Cart",
//             products,
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postCart = (req, res, next) => {
//   const productId = req.body.productId;
//   let fetchedCart;
//   let newQuantity = 1;
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       let product;
//       if (products.length > 0) {
//         product = products[0];
//       }
//       if (product) {
//         const oldQty = product.cartItem.qty;
//         newQuantity = oldQty + 1;
//       }

//       return Product.findByPk(productId);
//     })
//     .then((product) => {
//       fetchedCart.addProduct(product, { through: { qty: newQuantity } });
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postCartDeleteProduct = (req, res, next) => {
//   const productId = req.body.productId;
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       const product = products[0];
//       return product.cartItem.destroy();
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders({ include: ["products"] })
//     .then((orders) => {
//       res.render("shop/orders", {
//         path: "/orders",
//         pageTitle: "Your Orders",
//         orders,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postOrder = async (req, res, next) => {
//   try {
//     const products = await cart.getProducts();

//     const payload = products.map((product) => {
//       product.orderItem = { qty: product.cartItem.qty };
//       return product;
//     });

//     const order = await req.user.createOrder();

//     await order.addProducts(payload);
//     await cart.setProducts(null);

//     res.redirect("/orders");
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
