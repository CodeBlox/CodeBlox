var express = require('express');

var home = require('../controllers/home.js');
var codeblox = require('../controllers/codeblox');

var router = express.Router();

/* Home */
router.get('/', home.index);

/* CodeBlox */
router.get('/api/codeblox/', codeblox.getFunc);

module.exports = router;