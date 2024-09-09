const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class Product {
  constructor(title, price, imageUrl, description, id) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      dbOp = db.collection("products").updateOne(
        { _id: new mongodb.ObjectId(`${this._id}`) },
        {
          $set: {
            title: this.title,
            price: this.price,
            imageUrl: this.imageUrl,
            description: this.description,
          },
        }
      );
    } else {
      dbOp = db.collection("products").insertOne(this);
    }

    return dbOp
      .then((results) => console.log({ results }))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => console.log(err));
  }

  static findById(_id) {
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: new mongodb.ObjectId(`${_id}`) })
      .then((product) => product)
      .catch((err) => console.log(err));
  }

  static deleteById(_id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(`${_id}`) })
      .then(() => console.log("deleted"))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
