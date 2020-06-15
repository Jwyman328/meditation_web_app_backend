const addTodaysDateToJournalData = (journalData) => {
    journalData.date = new Date();
    return journalData
}

module.exports = addTodaysDateToJournalData;