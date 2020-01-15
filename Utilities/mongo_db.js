const mongoose = require('mongoose');


const connectDB = () => {
         // Live db
         // mongoose.connect('mongodb+srv://admin:excellency@cluster0-1zqux.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
         //     .then(() => console.log('db connected'))
         //     .catch(console.log);
    mongoose.connect('mongodb://database:27017/africave', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('db connect success'))
        .catch(console.log);
};

module.exports = { connectDB };
