const Joi = require('@hapi/joi');

const signUpUserModel = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

module.exports = signUpUserModel