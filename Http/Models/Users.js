const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    phone: String,
    password: String,
    subscriptions: {
        type: Array,
        required: false
    }
});

userSchema.pre('save', function () {

});

// Todo: Add model statics to get subscription and to hash password on pre save

const User = mongoose.model('Users', userSchema);

module.exports = User;
