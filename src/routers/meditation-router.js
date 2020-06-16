const express = require("express");
const meditationRouter = new express.Router();
const meditationListened = require('../models/meditationListened');


meditationRouter.post('/record-session-listened',async(req, res) =>{
    try{
        console.log('body', req.body, 'all', req)
        const meditationListenedData = req.body;
        meditationListenedData.date_time_listened = new Date()
        meditationListenedData.username = req.user.username;
        console.log('this user', req.user)
        const meditationListenedDataValidated = await meditationListened.validateAsync(meditationListenedData)
        const recordedMeditationListened = await req.db.collection('meditationListened').insertOne(meditationListenedDataValidated)
        console.log('created', recordedMeditationListened)
        res.status(201).send( recordedMeditationListened)
    }catch(e){
        console.log(e);
        res.status(400);
        res.send("error recording meditation listened");
    }
})

module.exports = meditationRouter;
