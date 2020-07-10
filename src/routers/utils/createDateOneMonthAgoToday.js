const createDateOneMonthAgoToday = () => {
    var today = new Date();
    //Change it so that it is 7 days in the past.
    var pastDate = today.getDate() - 30;
    today.setDate(pastDate);
    return today
}

module.exports = createDateOneMonthAgoToday;