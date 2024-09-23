const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const loginRoutes = require("./routes/auth");
const User = require("./models/user");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
// const { doubleCsrf } = require("csrf-csrf");
// const cookieParser = require("cookie-parser");

const uri =
  "mongodb+srv://Ehsan:HqdAjLDeFYCDNLLO@cluster0.amb7h.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";
const app = express();
const store = new MongoDBStore({
  uri,
  collection: "mySessions",
});
// const {
//   invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
//   generateToken, // Use this in your routes to provide a CSRF hash + token cookie and token.
//   validateRequest, // Also a convenience if you plan on making your own middleware.
//   doubleCsrfProtection, // This is the default CSRF protection middleware.
// } = doubleCsrf();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
// app.use(cookieParser());
// express.use(doubleCsrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(loginRoutes);

app.use(errorController.get404);

mongoose
  .connect(uri)
  .then(() => {
    console.log("connected");
    app.listen(3010);
  })
  .catch((err) => console.log(err));
