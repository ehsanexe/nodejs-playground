const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    const db = getDb();
    db.collection("products")
      .insertOne(this)
      .then((results) => console.log({ results }))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
