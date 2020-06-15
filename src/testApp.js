const express = require("express");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
require("dotenv").config();
var cors = require("cors");
app.use(cors());
// middleware 
const checkUserIsAuthenticated = require('./middlewares/checkUserIsAuthenticated')

//routers
const journalRouter = require("./routers/journal-router");
const authRouter = require("./routers/auth-router");


//mongodb
const MongoClient = require("mongodb").MongoClient;
var connectionAccount;

let db;
const setUp = async () => {

    connection = await MongoClient.connect(global.__MONGO_URI__, {
        useNewUrlParser: true,
      });
      db = await connection.db(global.__MONGO_DB_NAME__);
    ///
/*   connectionAccount = await MongoClient.connect( //process.env.DATABASEURL
    global.__MONGO_URI__
   ,
   {useNewUrlParser: true, useUnifiedTopology: true}
  ); */
  //db = await connectionAccount.db(global.__MONGO_DB_NAME__); // make a cluster
  // db = await connectionAccount.db("meditation-app"); // make a cluster
  try{
    let journals = await db.createCollection("journals"); // make a collection
  }catch(e){
      console.log('alrady exists')
  }

  //
  try{
    let users = await db.createCollection("users"); // make a collection
    await db.collection("users").createIndex({ username: 1 }, { unique: true });
}catch(e){
      console.log('alrady exists users')
  }
  console.log("listening oon port bannana here");
};
setUp()
const passDBToRouter =  (req,res,next)=>{ 
  try{
    req.db =  db;
    next()
  }
  catch(e){
    console.log(e)
    res.status(500)
    res.send('error')
  }
}
app.use(cors());
app.use('/journals/',passDBToRouter, checkUserIsAuthenticated, journalRouter);
app.use('/auth/',passDBToRouter, authRouter);

module.exports = app;