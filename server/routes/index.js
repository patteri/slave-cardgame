const express = require('express');

const router = express.Router();
router.use('/api/auth', require('./auth'));
router.use('/api/game', require('./game'));
router.use('/api/stats', require('./stats'));

module.exports = router;
