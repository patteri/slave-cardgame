const express = require('express');
const validator = require('validator');
const authService = require('../services/authService');

const router = express.Router();

const parseAndTrim = (req, property) => (req.body[property] || '').trim();

router.post('/login', (req, res) => {
  const username = parseAndTrim(req, 'username');
  const password = parseAndTrim(req, 'password');
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
  const username = parseAndTrim(req, 'username');
  const password = parseAndTrim(req, 'password');
  const email = parseAndTrim(req, 'email');

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

router.post('/activate', (req, res) => {
  const token = authService.parseTokenFromReq(req) || '';
  authService.activate(token).then(() => {
    res.sendStatus(200);
  }).catch(() => {
    res.status(400).json({ error: 'The token is invalid' });
  });
});

router.post('/remove', (req, res) => {
  const token = authService.parseTokenFromReq(req) || '';
  authService.remove(token).then(() => {
    res.sendStatus(200);
  }).catch(() => {
    res.status(400).json({ error: 'The token is invalid' });
  });
});

router.post('/forgot', (req, res) => {
  const email = parseAndTrim(req, 'email');
  authService.orderPasswordRenewal(email).then(() => {
    res.sendStatus(200);
  }).catch(() => {
    res.status(400).json({ error: 'The user wasn\'t recognized' });
  });
});

router.post('/renew', (req, res) => {
  const token = authService.parseTokenFromReq(req) || '';
  const password = parseAndTrim(req, 'password');

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

router.post('/username', (req, res) => {
  const token = authService.parseTokenFromReq(req) || '';
  const username = parseAndTrim(req, 'username');

  if (authService.validateUsername(username)) {
    authService.findUserByUsername(username).then((existing) => {
      if (existing == null) {
        authService.changeUsername(token, username).then((user) => {
          res.json(authService.generateAuthToken(user));
        }).catch(() => {
          res.status(400).json({ error: 'The token is invalid' });
        });
      }
      else {
        res.status(400).json({ error: 'The username is reserved' });
      }
    });
  }
  else {
    res.status(400).json({ error: 'The username is invalid' });
  }
});

router.get('/usernameAvailable', (req, res) => {
  authService.findUserByUsername(req.query.username).then((user) => {
    const available = user == null;
    res.json({ available: available });
  });
});

module.exports = router;
