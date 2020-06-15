const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 

const authRouter = new express.Router();
const signUpUserModel = require("../models/signUpUser")

authRouter.post("/sign_up", async (req, res) => {
    try{
      const user = await signUpUserModel.validateAsync(req.body);
      const newUserToken =  jwt.sign({email:user.email}, process.env.HASHKEY ) 
      user.password = await bcrypt.hash(user.password , 8 );
      await req.db.collection('users').insertOne({token:newUserToken, ...user })
      res.status(201)
      res.send({token:newUserToken })
    }catch(e){
      console.log(e)
      res.status(400);
      res.send('error')
    }
  })
  
  authRouter.post("/login", async (req, res) => {
    try{
      const user = await signUpUserModel.validateAsync(req.body);
      const dbUser = await req.db.collection('users').findOne({username:user.username});
      const isPasswordMatch = await bcrypt.compare( user.password, dbUser.password);
      if (isPasswordMatch){
        res.status(200);
        res.send({token:dbUser.token});
      }else{
        res.status(401);
        res.send('username or password does not exist')
      }
    } catch(e){
      console.log(e)
      res.status(401);
      res.send('error')
    }
    
  })
  

  module.exports = authRouter;
