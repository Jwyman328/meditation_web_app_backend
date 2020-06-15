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
const connectToMongo = require('./db/mongo_client_db')

let db;
app.listen(3000, async () => {
  try{
    connectionAccount = await MongoClient.connect(  //
      process.env.DATABASEURL
    ,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    //console.log(connection.d)
    db = await connectionAccount.db("meditation-app"); // make a cluster
    let journals = await db.createCollection("journals"); // make a collection
    let users = await db.createCollection("users"); // make a collection
    await db.collection("users").createIndex({ username: 1 }, { unique: true });
  
    console.log("listening oon port bannana 300");
  } catch(e) {
    console.log(e)
  }
  
});

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

app.use('/journals/',passDBToRouter, checkUserIsAuthenticated, journalRouter);
app.use('/auth/',passDBToRouter, authRouter);

module.exports = app;