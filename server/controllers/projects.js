var path = require('path');
var http = require('http');
var fs = require('fs');

var unzip = require('../controllers/unzip');
var config = require('../config/config');
var Project = require('../models/project.db');

module.exports.getProjects = function(req, res, next) {
	Project.find({}, function(err, projcets) {
        if (err) throw err;
        
        res.json(projcets);    
    });
};

module.exports.addProject = function(req, res, next) {
    var url = req.body.url;
    var filename = url.substring(url.lastIndexOf('/')+1);

    var file = fs.createWriteStream(config.tmpDir + 'zip/' + filename);
    var request = http.get(req.body.url, function(response) {
        response.pipe(file);
        req.params.name = filename.split('.')[0];
        unzip.index(req, res, next);
    });
}