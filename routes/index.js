var express = require('express');
var router = express.Router();

router.use('/api/test', require('./test'));

module.exports = router;
