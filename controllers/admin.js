const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, price, description);
  product.save();
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   const productId = req.params.product_id;
//   if (!editMode) {
//     return res.redirect("/");
//   }

//   Product.findByPk(productId)
//     .then((product) => {
//       if (!product) {
//         return res.redirect("/");
//       }

//       res.render("admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.getProducts = (req, res, next) => {
//   req.user.getProducts()
//     .then((products) => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postDeleteProduct = (req, res) => {
//   Product.destroy({ where: { id: req.body.productId } })
//     .then(() => {
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
