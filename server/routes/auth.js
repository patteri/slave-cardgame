const express = require('express');
const validator = require('validator');
const authService = require('../services/authService');

const router = express.Router();

router.post('/login', (req, res) => {
  const username = req.body.username || '';
  const password = req.body.password || '';
  authService.findUserByCredentials(username, password).then((user) => {
    if (user) {
      res.json({ token: authService.generateAuthToken(user) });
    }
    else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

router.post('/register', (req, res) => {
  const username = req.body.username || '';
  const password = req.body.password || '';
  const email = req.body.email || '';

  if (authService.validateUsername(username) && authService.validatePassword(password) && validator.isEmail(email)) {
    authService.findUserByUsername(username).then((user) => {
      if (user == null) {
        authService.register(username, password, email).then(() => {
          res.sendStatus(200);
        });
      }
      else {
        res.status(400).json({ error: 'The username is reserved' });
      }
    });
  }
  else {
    res.status(400).json({ error: 'The request is invalid' });
  }
});

router.get('/usernameAvailable', (req, res) => {
  authService.findUserByUsername(req.query.username).then((user) => {
    const available = user == null;
    res.json({ available: available });
  });
});

module.exports = router;
