const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(email, password, id, cart) {
    this.email = email;
    this.password = password;
    this.id = id ? new mongodb.ObjectId(`${id}`) : null;
    this.cart = cart;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const existingProductIndex = this.cart.items.findIndex(
      (cartItem) => cartItem.productId.toString() === product._id.toString()
    );

    const cartItems = [...this.cart.items];

    if (existingProductIndex >= 0) {
      cartItems[existingProductIndex].qty += 1;
    } else {
      cartItems.push({
        productId: new mongodb.ObjectId(`${product._id}`),
        qty: 1,
      });
    }
    const updatedCart = {
      items: cartItems,
    };

    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: this.id }, { $set: { cart: updatedCart } });
  }

  async getCart() {
    try {
      const db = getDb();
      const prodcutIds = this.cart.items.map((i) => i.productId);
      const products = await db
        .collection("products")
        .find({ _id: { $in: prodcutIds } })
        .toArray();

      return products.map((p) => {
        const qty = this.cart.items.find(
          (ci) => ci.productId.toString() === p._id.toString()
        ).qty;
        return { ...p, qty };
      });
    } catch (error) {
      console.log(error);
    }
  }

  static findById(_id) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(`${_id}`) })
      .then((user) => user)
      .catch((err) => console.log(err));
  }
}

module.exports = User;
