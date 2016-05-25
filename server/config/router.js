var express = require('express');

var home = require('../controllers/home.js');

var router = express.Router();

/* Home */
router.get('/', home.index);



module.exports = router;