var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes');

// Create and configure Express app
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Register routes
app.use(routes);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

module.exports = app;