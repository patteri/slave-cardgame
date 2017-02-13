var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.json({content: 'This is a response for a call to \'/api/test\''});
});

module.exports = router;
