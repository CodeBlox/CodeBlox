var express = require('express');

var home = require('../controllers/home');
var student = require('../controllers/student');

var router = express.Router();

router.get('/', home.index);

/* Server */
router.get('/api/students', student.getAll);
router.post('/api/students', student.addStudent);

router.get('/api', function(req, res, next) {
    res.send("GET api/students - return all students<br>POST api/students - Add student, need to send data like {name: 'student name'}");
});

module.exports = router;