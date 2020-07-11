const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());
var bodyParser = require("body-parser");
app.use(bodyParser.json());
require("dotenv").config();
const helmet = require("helmet");

app.use(helmet());
// middleware 
const checkUserIsAuthenticated = require('./middlewares/checkUserIsAuthenticated')

//routers
const journalRouter = require("./routers/journal-router");
const authRouter = require("./routers/auth-router");
const meditationRouter = require('./routers/meditation-router');


//mongodb
const MongoClient = require("mongodb").MongoClient;
var connectionAccount;
const connectToMongo = require('./db/mongo_client_db');
const moodsRouter = require("./routers/moods-rotuer");

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
    let meditationListened = await db.createCollection("meditationListened"); // make a collection
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
app.use('/meditation/', passDBToRouter,checkUserIsAuthenticated, meditationRouter)
app.use('/moods/',passDBToRouter, checkUserIsAuthenticated, moodsRouter);

module.exports = app;