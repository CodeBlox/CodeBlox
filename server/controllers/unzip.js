var config = require('../config/config');
var AdmZip = require('adm-zip');
var mkdirp = require('mkdirp');

module.exports.index = function(req, res, next) {
	// Creating a new directory 
	mkdirp('C:\\Users\\Toval\\Desktop\\codeblox\\server\\files\\unzip\\test', function(err) { 
		// Extracting the files from zip directory
		var zip = new AdmZip("C:\\Users\\Toval\\Desktop\\test.zip");
		zip.extractAllTo("C:\\Users\\Toval\\Desktop\\codeblox\\server\\files\\unzip\\test", true);
	});
};

