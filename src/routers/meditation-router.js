const express = require("express");
const meditationRouter = new express.Router();
const meditationListened = require("../models/meditationListened");

meditationRouter.post("/", async (req, res) => { //record-session-listened
  try {
    const meditationListenedData = req.body;
    meditationListenedData.date_time_listened = new Date();
    meditationListenedData.username = req.user.username;
    const meditationListenedDataValidated = await meditationListened.validateAsync(
      meditationListenedData
    );
    const recordedMeditationListened = await req.db
      .collection("meditation-sessions")
      .insertOne(meditationListenedDataValidated);
    res.status(201).send(recordedMeditationListened);
  } catch (e) {
    console.log(e);
    res.status(400);
    res.send("error recording meditation listened");
  }
});

meditationRouter.get("/", async (req, res) => {
  try {
    const allMeditationsListened = await req.db
      .collection("meditation-sessions")
      .find({ username: req.user.username }).sort( { date_time_listened
        : 1 } )
      .toArray();
    res.status(200).send(allMeditationsListened);
  } catch (e) {
    console.log(e);
    res.status(400);
    res.send("error recording meditation listened");
  }
});

module.exports = meditationRouter;
