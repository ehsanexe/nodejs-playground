const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  save() {
    const db = getDb();
    db.collection("users").insertOne(this);
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
