const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const orderScehma = new Schema({
  products: [{
    product: {
      type: Object,
      required: true,
    },
    qty: { type: Number, required: true },
  }],
  user: {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("Order", orderScehma);
