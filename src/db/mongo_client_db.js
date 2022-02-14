const MongoClient = require("mongodb").MongoClient;

//var connectionAccount;

const dataBaseLocation =
  process.env.NODE_ENV === "DEV"
    ? process.env.LOCAL_DOCKER_DB_URL
    : process.env.DATABASEURL;

const connectToMongo = async () => {
  let connectionAccount = await MongoClient.connect(dataBaseLocation, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return connectionAccount;
};

module.exports = connectToMongo;
