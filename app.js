require("dotenv").config(); // Load environment variables
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
const { doubleCsrf } = require("csrf-csrf");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const multer = require("multer");

const uri = process.env.MONGO_DB;
const app = express();
const store = new MongoDBStore({
  uri,
  collection: "mySessions",
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage, fileFilter });

const {
  doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf({
  getSecret: () => "Secret",
  cookieName: "csrf",
  getTokenFromRequest: (req) => {
    return req.body.csrfToken}
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(cookieParser());
app.use(upload.single("image"));
app.use(doubleCsrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
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
    next(new Error(error));
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(loginRoutes);

app.use(errorController.get404);
app.use(errorController.get500);

mongoose
  .connect(uri)
  .then(() => {
    console.log("connected");
    app.listen(process.env.DEV_PORT);
  })
  .catch((err) => console.log(err));
