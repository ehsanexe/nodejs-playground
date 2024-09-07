const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(
    "mongodb+srv://Ehsan:HqdAjLDeFYCDNLLO@cluster0.amb7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      _db = client.db("shop");
      console.log("Connected");
      cb();
    })
    .catch((err) => {
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "DB not found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
