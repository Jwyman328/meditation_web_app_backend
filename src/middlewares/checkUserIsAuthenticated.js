const jwt = require("jsonwebtoken");
const tokenModel = require('../models/token');

async function checkUserIsAuthenticated(req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log(token, ' this is token')
    console.log(req.body, 'this is body')
    const tokenValidated = await tokenModel.validateAsync(token)
    const [jwt,restToken] = token.split('JWT ')
    console.log('post split', restToken)
    const user = await req.db.collection('users').findOne({ token: restToken  }); 
    const allUsers = await req.db.collection('users').find({}).toArray()
    req.user = user; // add the user to the request
    console.log('this is user', req.user, 'all users', allUsers)
    if (user) {
      next();
    } else {
      throw Error("no token");
    }
  } catch (error) {
    res.status(401).send("error on authentication");
  }
}

module.exports = checkUserIsAuthenticated;
