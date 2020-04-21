const mongoose = require("mongoose");
const { mongoDBUrl } = require("./constants");

const connectDB = () => {
  // Live db
  mongoose
    .connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("db connected"))
    .catch(console.log);
};

module.exports = { connectDB };
