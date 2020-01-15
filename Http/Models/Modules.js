const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
    title: String,
    body: String,
    courseID: mongoose.SchemaTypes.ObjectId,
    created: Date,
    order: Number,
});

const Module = mongoose.model('Modules', moduleSchema);

module.exports = Module;
