const fs = require("fs");
const path = require("path");
const Cart = require("./cart");
// const db = require("../util/database");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    // return db.execute(
    //   "INSERT INTO products (id, title, imageUrl, description, price) VALUES (?,?,?,?,?)",
    //   [this.id, this.title, this.imageUrl, this.description, this.price]
    // );
    getProductsFromFile((products) => {
      if (this.id) {
        const index = products.findIndex((p) => p.id === this.id);
        products[index] = this;
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    // return db.execute("SELECT * FROM products");
    getProductsFromFile(cb);
  }

  static findById(id) {
    // return db.execute("SELECT * FROM products where id=?", [id]);
    getProductsFromFile((products) => {
      cb(products.find((p) => p.id === id));
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const prod = products.find((p) => p.id === id);
      const updatedProducts = products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteById(id, prod.price);
        }
        console.log(err);
      });
    });
  }
};
