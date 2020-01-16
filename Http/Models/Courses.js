const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: String,
    body: String,
    created: {
        type: Date,
        default: Date.now()
    },
    duration: Number,
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Modules", required: false }],
});

// Todo: Add model after save to compute the correct duration of each course in days

const Course = mongoose.model('Courses', courseSchema);

module.exports = Course;
