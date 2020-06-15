const Joi = require('@hapi/joi');

const journalModel = Joi.object({
    text: Joi.string().required(),
    mood: Joi.number().min(0).max(4).required(),
    date: Joi.date().required()
})

module.exports = journalModel