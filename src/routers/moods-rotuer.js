const express = require("express");
const moodsRouter = new express.Router();
const createDateOneWeekAgoToday = require("./utils/createDateOneWeekAgoToday");
const createDateOneMonthAgoToday = require("./utils/createDateOneMonthAgoToday");

moodsRouter.get("/past_month", async (req, res) => {
  try {
      console.log('hit here')
    const today = new Date();
    const dateOneMonthAgo = createDateOneMonthAgoToday();
    const pastMonthJournals = await req.db
      .collection("journals")
      .find(
        {
          user: req.user.username,
          date: { $gte: dateOneMonthAgo, $lte: today },
        },
        { projection: { mood: 1 } }
      ) //"
      .toArray();
    const moodData = pastMonthJournals.map((moodData) => {
      return moodData.mood;
    });

    res.status(200);
    res.send(moodData);
  } catch (e) {
    console.log(e);
    res.status(400);
    res.send("error");
  }
});

moodsRouter.get("/past_week", async (req, res) => {
  try {
    const today = new Date();
    const dateOneWeekAgo = createDateOneWeekAgoToday();

    const pastWeekJournals = await req.db
      .collection("journals")
      .find(
        {
          user: req.user.username,
          date: { $gte: dateOneWeekAgo, $lte: today },
        },
        { projection: { mood: 1 } }
      ) //"
      .toArray();
    const moodData = pastWeekJournals.map((moodData) => {
      return moodData.mood;
    });
    res.status(200);
    res.send(moodData);
  } catch (e) {
    console.log(e);
    res.status(400);
    res.send("error");
  }
});

module.exports = moodsRouter;
