var express = require('express');
var router = express.Router();
var config = require('../config');

/* GET home page. */
router.get('/example', function(req, res) {
  res.render('example', { title: 'examples' });
});

module.exports = router;
