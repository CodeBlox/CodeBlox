var express = require('express');

var home = require('../controllers/home.js');
var codeblox = require('../controllers/codeblox');
var unzip = require('../controllers/unzip.js');
var projects = require('../controllers/projects.js')
var router = express.Router();

/* Home */
router.get('/', home.index);
router.get('/unzip/:name', unzip.index);
router.get('/projects', projects.getProjects);
router.post('/projects', projects.addProject);

/* CodeBlox */
router.get('/api/codeblox/', codeblox.saveProject);
router.get('/api/codeblox/getParams', codeblox.saveProject);

module.exports = router;