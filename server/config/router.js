var express = require('express');

var home = require('../controllers/home.js');

var router = express.Router();

/* Home */
router.get('/', home.index);

// Test

module.exports = router;