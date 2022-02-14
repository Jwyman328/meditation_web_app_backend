const express = require("express");
const app = express();
var bodyParser = require("body-parser");
//var cors = require("cors");
//app.use(cors({origin:true,credentials: true}));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
require("dotenv").config();
// middleware
const checkUserIsAuthenticated = require("./middlewares/checkUserIsAuthenticated");

//routers
const journalRouter = require("./routers/journal-router");
const authRouter = require("./routers/auth-router");
const moodsRouter = require("./routers/moods-rotuer");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//mongodb
const MongoClient = require("mongodb").MongoClient;
var connectionAccount;

let db;
app.listen(3000, async () => {
  try {
    connectionAccount = await MongoClient.connect(process.env.DATABASEURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connectionAccount.db("meditation-app"); // make a cluster
    let journals = await db.createCollection("journals"); // make a collection
    let users = await db.createCollection("users"); // make a collection
    await db.collection("users").createIndex({ username: 1 }, { unique: true });
    await db.collection("journals").createIndex({ date: -1 });

    console.log("listening oon port 3000", process.env.DATABASEURL);
  } catch (e) {
    console.log(e);
  }
});

const passDBToRouter = (req, res, next) => {
  try {
    req.db = db;
    next();
  } catch (e) {
    console.log(e);
    res.status(500);
    res.send("error");
  }
};
app.use(function (req, res, next) {
  console.log("i was hit");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/journals/", passDBToRouter, checkUserIsAuthenticated, journalRouter);
app.use("/moods/", passDBToRouter, checkUserIsAuthenticated, moodsRouter);

app.use("/auth/", passDBToRouter, authRouter);

module.exports = app;
