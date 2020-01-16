const Joi = require('@hapi/joi');

const createUser = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    phone: Joi.string().required(),
});

const createMultipleUsers = Joi.array().items(createUser);

const createSubscriptionForUser = Joi.object({
    userID: Joi.string().required(),
    courseID: Joi.string().required(),
    module: Joi.number().required(),
    time: Joi.string().required(),
    duration: Joi.number().required(),
    status: Joi.string().allow("complete", "active", "canceled").required(),
    completed: Joi.date()
});

module.exports = {
    createUser,
    createMultipleUsers,
    createSubscriptionForUser
};