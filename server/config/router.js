var express = require('express');

var home = require('../controllers/home.js');
var codeblox = require('../controllers/codeblox');
var unzip = require('../controllers/unzip.js');

var router = express.Router();

/* Home */
router.get('/', home.index);
router.get('/unzip', unzip.index);

/* CodeBlox */
router.get('/api/codeblox/', codeblox.getFunc);

module.exports = router;