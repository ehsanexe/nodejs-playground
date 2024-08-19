const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(__dirname), "data", "products.json");

const getProductsFromFile = (callBack) => {
  fs.readFile(p, (err, data) => {
    if (err) {
      callBack([]);
      return;
    }
    callBack(JSON.parse(data));
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log({ err });
      });
    });
  }

  static fetchAllProducts(callBack) {
    getProductsFromFile(callBack);
  }
};
