var express = require('express');

var home = require('../controllers/home');
var student = require('../controllers/student');

var router = express.Router();

router.get('/', home.index);

/* Server */
router.get('/api/students', student.getAll);
router.post('/api/students', student.addStudent);

module.exports = router;