const Joi = require('@hapi/joi');

const meditationListened = Joi.object({
    username: Joi.string().email().required(),
    date_time_listened: Joi.date().required(),
    meditation_name : Joi.string(),
    meditation_amount_time_listened : Joi.number(),
})

module.exports = meditationListened;