const mongoose = require('mongoose');
const { mongoDBUrl } = require("./constants");


const connectDB = () => {
    // Live db
    mongoose.connect('mongodb+srv://admin:excellency@cluster0-1zqux.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('db connected'))
        .catch(console.log);
    // mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    //     .then(() => console.log('db connect success'))
    //     .catch(console.log);
};

module.exports = { connectDB };
