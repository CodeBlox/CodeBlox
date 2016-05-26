var express = require('express');

var home = require('../controllers/home');
var codeblox = require('../controllers/codeblox');
var unzip = require('../controllers/unzip');
var projects = require('../controllers/projects');
var download = require('../controllers/download');

var router = express.Router();

/* Home */
router.get('/', home.index);
router.get('/unzip/:name', unzip.index);

/* Projects */
router.get('/api/projects', projects.getProjects);
router.post('/api/projects', projects.addProject);


router.post('/api/codeblox/:name', codeblox.deleteFunc);

/* CodeBlox */
router.get('/api/codeblox/', codeblox.saveProject);
router.get('/api/codeblox/getParams', codeblox.saveProject);

router.get('/api/download/:key', download.getZip);

module.exports = router;