const express = require("express");
const journalRouter = new express.Router();
const journalModel = require("../models/journal");
const addTodaysDateToJournalData = require("./utils/addTodaysDateToJournalData");
const createDateOneWeekAgoToday = require('./utils/createDateOneWeekAgoToday');
journalRouter.post("/", async (req, res) => {
  try {
    let journalDataWithTodaysDate = addTodaysDateToJournalData(req.body);
    const journalData = await journalModel.validateAsync(req.body);
    let createJournal = await req.db.collection("journals").insertOne({
      user: req.user.username,
      ...journalData,
    });
    res.status(201);
    res.send("journal created");
  } catch (e) {
    console.log(e);
    res.status(400);
    res.send("error creating journal");
  }
});

journalRouter.get("/", async (req, res) => {
  try {
    const kidDadData = await req.db
      .collection("journals")
      .find({ user: req.user.username })
      .toArray();
    res.send(kidDadData);
  } catch (e) {
    console.log(e);
    res.status(501);
    res.send("error");
  }
});

journalRouter.get("/past_week", async (req, res) => {
  try {
    const today = new Date();  
    const dateOneWeekAgo = createDateOneWeekAgoToday()

    const pastWeekJournals = await req.db
      .collection("journals")
      .find({
        user: req.user.username,
        date: { $gte: dateOneWeekAgo, $lte: today },
      }) //"
      .toArray();
      
    res.status(200);
    res.send(pastWeekJournals);
  } catch (e) {
    console.log(e);
    res.status(400);
    res.send("error");
  }
});

module.exports = journalRouter;
