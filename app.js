const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");
// const User = require("./models/user");
const { default: mongoose } = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// app.use((req, res, next) => {
//   User.findById("66de9b738062b5007c050d5e")
//     .then((user) => {
//       req.user = new User(user.email, user.password, user._id, user.cart);
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://Ehsan:HqdAjLDeFYCDNLLO@cluster0.amb7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected");
    app.listen(3010);
  })
  .catch((err) => console.log(err));
