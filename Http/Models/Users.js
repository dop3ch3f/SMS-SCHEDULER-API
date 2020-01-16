const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const subscriptionSchema = require("./Subscription");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;



const userSchema = new Schema({
    name: String,
    phone: String,
    password: String,
    subscriptions: [{
        type: Schema.Types.ObjectId,
        required: false, ref: 'Subscriptions'
    }],
});


// hash password before every save
userSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// to compare password for easy login
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


// Append subscriptions every find one
// userSchema.post("findOne", async function (result, next) {
//     try {
//         const subscriptions = await subscriptionSchema.find({
//             '_id': {
//                 $in: result.subscriptions.map(subscription => mongoose.Schema.Types.ObjectId(subscription))
//             }
//         });
//         result.subscriptionDetails = subscriptions;
//     } catch (error) {
//         console.log(error);
//     }
// });

// delete subscriptions to every delete user
userSchema.pre("deleteOne", { document: true }, async function (next) {
    try {
        const id = this.getQuery()["_id"];
        await mongoose.model("Subscriptions").deleteMany({ userID: id });
        next();
    } catch (error) {
        next(error);
    }

});


const User = mongoose.model('Users', userSchema);

module.exports = User;
