var config = require('../config/config');
var AdmZip = require('adm-zip');
var mkdirp = require('mkdirp');
var slash = require('slash');

var codeblox = require('../controllers/codeblox');

module.exports.index = function(req, res, next) {
	try {
		// Creating a new directory 
		mkdirp(slash(config.tmpDir + 'extract/' + req.params.name), function(err) { 
			try {
				var zip = new AdmZip(slash(config.tmpDir + 'zip/' + req.params.name + '.zip'));
				zip.extractAllTo(slash(config.tmpDir + 'extract/' + req.params.name), true);
				
				codeblox.saveProject(req, res, next);
			} catch(e) {
				console.error(e);
				res.sendStatus(500);
			}
		});
	} catch(e) {
		console.error(e);
		res.sendStatus(500);
	}
};

