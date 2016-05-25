var path = require('path');
var unzip = require('../controllers/unzip');
var config = require('../config/config');
var mongoose = require('mongoose');
var splitText = require('split-text');
var Schema = mongoose.Schema;

module.exports.getProjects = function(req, res, next) {
	mongoose.connect('mongodb://localhost/test');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        var projectsSchema = new Schema({
            projName: String,
            funcs: [{ fileName: String, funcName: String }]
        });
        
        var project = mongoose.model('codeBlox', projectsSchema);
        
        // // Creating 2 projects hard-coded
        // var proj1 = new project({ 
        //     projName: 'firstProject', 
        //     funcs: [
        //         { fileName: 'index.html', funcName: 'par'},
        //         { fileName: 'hello.html', funcName: 'head'}
        //         ]
        //     });
            
        // var proj2 = new project({ 
        //     projName: 'secProject', 
        //     funcs: [
        //         { fileName: 'or.html', funcName: 'h1'},
        //         { fileName: 'dagan.html', funcName: 'h2'}
        //         ]
        //     });
        // // end of creating projects
        //proj1.save();
        //proj2.save();
        
        project.find(function (err, projects) {
           res.json(projects); 
        //    req.params.path = "C:\\Users\\Toval\\Desktop\\test.zip";
        //    module.exports.addProject(req, res, next);
        });
    });
};

module.exports.addProject = function(req, res, next) {
    console.log(req.body.path);
    var name = path.basename(req.body.path);
    //req.params.name = name.splitText(name.length - 4);
    req.params.name = splitText(name, 4)[0];
    unzip.index(req, res, next);
}