const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());
var bodyParser = require("body-parser");
app.use(bodyParser.json());
require("dotenv").config();
const helmet = require("helmet");

app.use(helmet());

const checkUserIsAuthenticated = require("./middlewares/checkUserIsAuthenticated");
//routers
const journalRouter = require("./routers/journal-router");
const authRouter = require("./routers/auth-router");
const meditationRouter = require("./routers/meditation-router");

//mongodb
const MongoClient = require("mongodb").MongoClient;
var connectionAccount;
const connectToMongo = require("./db/mongo_client_db");
const moodsRouter = require("./routers/moods-rotuer");

let db;
const dataBaseLocation =
  process.env.NODE_ENV === "DEV"
    ? process.env.LOCAL_DOCKER_DB_URL
    : process.env.DATABASEURL;
app.listen(
  (process.env.PORT && process.env.NODE_ENV !== "DEV") || 3000,
  async () => {
    try {
      connectionAccount = await MongoClient.connect(
        //
        dataBaseLocation,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      db = await connectionAccount.db("meditation-app"); // make a cluster
      let journals = await db.createCollection("journals"); // make a collection
      let users = await db.createCollection("users"); // make a collection
      let meditationListened = await db.createCollection("meditation-sessions"); // make a collection
      await db
        .collection("users")
        .createIndex({ username: 1 }, { unique: true });

      console.log("listening oon port bannana 300");
    } catch (e) {
      console.log(e);
    }
  }
);

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

app.use("/journals/", passDBToRouter, checkUserIsAuthenticated, journalRouter);
app.use("/auth/", passDBToRouter, authRouter);
app.use(
  "/meditation-sessions/",
  passDBToRouter,
  checkUserIsAuthenticated,
  meditationRouter
);
app.use("/moods/", passDBToRouter, checkUserIsAuthenticated, moodsRouter);

module.exports = app;
