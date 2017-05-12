const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes');
const path = require('path');

// Create and configure Express app
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'production') {
  app.use(logger('dev'));
}

// Register routes
app.use(routes);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  const pathName = path.join(__dirname, '../client/build');
  app.use(express.static(pathName));
  app.get('*', (req, res) => {
    res.sendFile(`${pathName}/index.html`);
  });
}

module.exports = app;
