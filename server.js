const express = require('express');
global.__basedir = __dirname;
const helmet = require("helmet");
const logger = require('morgan');
const bodyParser = require('body-parser');
const Response = require("./Utilities/response_generator");
const { Application_Responses } = require('./Utilities/enums');
const routes = require('./Http/Routes/index');
const { connectDB } = require("./Utilities/mongo_db");
const Agenda = require("agenda");
const { mongoDBUrl } = require("./Utilities/constants");
const agenda = new Agenda({ db: { address: mongoDBUrl } });
const app = express();

//Bootstrap Necessary before express
connectDB();
(async function () { // IIFE to give access to async/await
    await agenda.start();
})();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(helmet());
routes.forEach((route) => {
    app.use('/api', route);
});
app.use(function (err, req, res, next) {
    console.error(`Server Error: ${err.stack}`);
    return new Response(Application_Responses["SERVER-ERROR"], null, err, null, res).getResponse();
});


module.exports = app.listen(3000, () => console.log(`Server @ port ${3000}`));
