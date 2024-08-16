const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const router = require("./routes/index");

app.use(router);

app.listen(3010);
