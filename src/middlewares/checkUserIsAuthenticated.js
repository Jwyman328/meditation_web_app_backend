const jwt = require("jsonwebtoken");
const tokenModel = require('../models/token');

async function checkUserIsAuthenticated(req, res, next) {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const tokenValidated = await tokenModel.validateAsync(token)
    const user = await req.db.collection('users').findOne({ token: tokenValidated  }); 
    req.user = user; // add the user to the request
    if (user) {
      next();
    } else {
      throw Error("no token");
    }
  } catch (error) {
    console.log(error);
    res.status(401).send("error on authentication");
  }
}

module.exports = checkUserIsAuthenticated;
