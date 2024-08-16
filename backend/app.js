'use strict';

/** Express app for FaunaFinder **/

const express = require('express');
const cors = require('cors');

const { NotFoundError } = require('./expressError');

const faunaRoutes = require('./routes/faunae');
const locationRoutes = require('./routes/locations');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running....');
});

app.use("/faunae", faunaRoutes);
app.use("/locations", locationRoutes);

/** Handle 404 errors **/
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

/** Error handler **/
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
});

module.exports = app;