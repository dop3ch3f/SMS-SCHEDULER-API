const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: String,
    body: String,
    created: Date,
    duration: Number,
    modules: [mongoose.SchemaTypes.objectId],
});

// Todo: Add model statics to get modules in a course
// Todo: Add model after save to compute the correct duration of each course in days

const Course = mongoose.model('Courses', courseSchema);

module.exports = Course;
