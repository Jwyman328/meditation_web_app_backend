const MongoClient = require('mongodb').MongoClient


//var connectionAccount;

const connectToMongo = async () => {
    let connectionAccount = await MongoClient.connect(
        process.env.DATABASEURL,
         {
           useNewUrlParser: true,
           useUnifiedTopology: true,
         }
       );
    return connectionAccount
}



module.exports = connectToMongo;
