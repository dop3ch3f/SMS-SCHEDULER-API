const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: "Courses" },
    jobID: { type: String, required: false },
    module: Number,
    time: String,
    duration: Number,
    status: {
        type: String, enum: ['complete', 'active', 'canceled']
    },
    completed: Date,
});

const Subscription = mongoose.model('Subscriptions', subscriptionSchema);

module.exports = Subscription;
