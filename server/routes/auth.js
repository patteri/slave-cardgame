const express = require('express');
const validator = require('validator');
const authService = require('../services/authService');

const router = express.Router();

router.post('/login', (req, res) => {
  const username = req.body.username || '';
  const password = req.body.password || '';
  authService.findUserByCredentials(username, password).then((user) => {
    if (user) {
      res.json(authService.generateAuthToken(user));
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

router.post('/forgot', (req, res) => {
  const email = req.body.email || '';
  authService.orderPasswordRenewal(email).then(() => {
    res.sendStatus(200);
  }).catch(() => {
    res.status(400).json({ error: 'The user wasn\'t recognized' });
  });
});

router.post('/renew', (req, res) => {
  const token = req.body.token || '';
  const password = req.body.password || '';

  if (authService.validatePassword(password)) {
    authService.changePassword(token, password).then(() => {
      res.sendStatus(200);
    }).catch(() => {
      res.status(400).json({ error: 'The token is invalid' });
    });
  }
  else {
    res.status(400).json({ error: 'The password is invalid' });
  }
});

router.get('/usernameAvailable', (req, res) => {
  authService.findUserByUsername(req.query.username).then((user) => {
    const available = user == null;
    res.json({ available: available });
  });
});

module.exports = router;
