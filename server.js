const express = require('express');
const helmet = require("helmet");
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./Http/Routes/index');
const { connectDB } = require("./Utilities/mongo_db");
const app = express();

//Bootstrap Necessary before express
connectDB();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(helmet());
routes.forEach((route) => {
    app.use('/api', route);
});
app.use(function (err, req, res, next) {
    console.error(`Server Error: ${err.stack}`);
    return res.json("A Server Error occurred, try again later ")
});


app.listen(3000, () => console.log(`Server @ port ${3000}`));
