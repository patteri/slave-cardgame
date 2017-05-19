const express = require('express');
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

router.get('/usernameAvailable', (req, res) => {
  authService.findUserByUsername(req.query.username).then((user) => {
    const available = user == null;
    res.json({ available: available });
  });
});

module.exports = router;
