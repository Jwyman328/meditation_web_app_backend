const express = require("express");
const meditationRouter = new express.Router();
const meditationListened = require('../models/meditationListened');


meditationRouter.post('/record-session-listened',async(req, res) =>{
    try{
        const meditationListenedData = req.body;
        meditationListenedData.date_time_listened = new Date()
        meditationListenedData.username = req.user.username;
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

meditationRouter.get('/',async(req, res) =>{
    try{
        console.log(' i was hit')
        const allMeditationsListened = await req.db.collection('meditationListened').find({username:req.user.username}).toArray()
        res.status(200).send( allMeditationsListened)
    }catch(e){
        console.log(e);
        res.status(400);
        res.send("error recording meditation listened");
    }
})

module.exports = meditationRouter;
