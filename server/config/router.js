var express = require('express');

var home = require('../controllers/home.js');
var unzip = require('../controllers/unzip.js');

var router = express.Router();

/* Home */
router.get('/', home.index);
router.get('/unzip', unzip.index);

// Test

module.exports = router;