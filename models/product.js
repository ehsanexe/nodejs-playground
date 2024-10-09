const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const productScehma = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
  },
  stripePriceId: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", productScehma);
