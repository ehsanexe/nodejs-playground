const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const existingProductIndex = this.cart.items.findIndex(
    (cartItem) => cartItem.productId.toString() === product._id.toString()
  );

  const cartItems = [...this.cart.items];

  if (existingProductIndex >= 0) {
    cartItems[existingProductIndex].qty += 1;
  } else {
    cartItems.push({
      productId: product._id,
      qty: 1,
    });
  }
  const updatedCart = {
    items: cartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
