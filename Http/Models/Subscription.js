const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
   userID: mongoose.SchemaTypes.objectId,
   courseID: mongoose.SchemaTypes.objectId,
   module: Number,
   time: String,
   duration: Number,
   status: {
       type: String, enum: ['complete','pending']
   },
   completed: Date,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
