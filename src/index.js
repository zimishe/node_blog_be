const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const logger = require("morgan");
const { URL } = require("./_config/db");
const port = process.env.PORT || 8000;

const app = express();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  require("./routes")(app, db);
  app.listen(port, () => {
    console.log("Server is live at ", port);
  });
});

// MongoClient.connect(
//   URL,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   },
//   (err, database) => {
//     if (err) return console.log(err);
//     require("./routes")(app, database);

//     app.listen(port, () => {
//       console.log("Server is live at ", port);
//     });
//   }
// );
