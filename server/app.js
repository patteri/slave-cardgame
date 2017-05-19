const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes');
const path = require('path');
const dbService = require('./services/databaseService');

// Create and configure Express app
const app = express();

dbService.connect();
if (process.env.NODE_ENV !== 'production') {
  dbService.clear();
  dbService.initDev();
}

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

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});
app.use((err, req, res) => {
  const message = { error: 'Unexpected error occurred' };
  if (process.env.NODE_ENV !== 'production') {
    message.stackTrace = err;
  }
  res.status(err.status || 500).json(message);
});

process.on('exit', () => {
  dbService.disconnect();
});

module.exports = app;
