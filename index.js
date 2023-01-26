const express = require("express");
const app = express();
const path = require("path");

//Config dot env variables
require("dotenv").config({});

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//allow postman and html forms to be parsed
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Connect to database
mongoose
  .connect(process.env.DB_URI || 4000, {})
  .then((con) => {
    console.log(`Mongoose connected with host `, con.connection.host);
  })
  .catch((err) => console.log(err));

// app.get("/", (req, res) => {
//   res.status(200).send("Welcome to gritquiz");
// });

//Routes imports
const quizes = require("./routes/quizes");
const auth = require("./routes/auth");
const category = require("./routes/category");

//Routes
app.use("/v1/quizes", quizes);
app.use("/v1/auth", auth);
app.use("/v1/category", category);

app.use(express.static(path.join(__dirname, "./client/build/")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build/index.html"));
});

//Run server
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});
