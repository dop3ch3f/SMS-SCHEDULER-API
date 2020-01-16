const Joi = require('@hapi/joi');

const createCourse = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
});

const createMultipleCourses = Joi.array().items(createCourse);

const createModuleForCourse = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    courseID: Joi.string().required(),
});

const createMultipleModulesForCourse = Joi.array().items(createModuleForCourse);

module.exports = {
    createCourse,
    createModuleForCourse,
    createMultipleModulesForCourse,
    createMultipleCourses
}