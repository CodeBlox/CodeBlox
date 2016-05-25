var fs = require('fs');
var recursive = require('recursive-readdir');
var AdmZip = require('adm-zip');
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var config = require('../config/config');

module.exports.saveProject = function(req, res, next) {
    getFileInDir(config.tmpDir + 'extract/' + req.params.name, function(files) {
        
        var codebloxfunctions = [];
        
        for(var i = 0; i < files.length; i++){
            var fileContent = fs.readFileSync(files[i], "utf8");
            var startFunctions = [];

            var re = new RegExp("<!--.*{CodeBlox\\+(.*)}.*-->", "gmi");
            
            var match = re.exec(fileContent);

            while (match != null) {
                startFunctions.push(match[1]);
                match = re.exec(fileContent);
            }
            
            for (var s = 0; s < startFunctions.length; s++) {
                var re = new RegExp("<!--.*{CodeBlox\\+" + startFunctions[s] + "}.*-->[^]*<!--.*{CodeBlox\\-" + startFunctions[s] + "}.*-->", "gmi");
                var match = re.exec(fileContent);
                while (match != null) {
                    codebloxfunctions.push({
                        fileName: files[i],
                        funcName: startFunctions[s]
                    });
                    
                    match = re.exec(fileContent);
                }
            }
        }
        
        // Saving the project to db
        mongoose.connect('mongodb://localhost/test');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var projectsSchema = new Schema({
                projName: String,
                funcs: [{ fileName: String, funcName: String }]
            });
            
            var project = mongoose.model('codeBlox', projectsSchema);
            
            var proj1 = new project({ 
                projName: req.params.name, 
                funcs: codebloxfunctions
                });
                
            proj1.save();
        })
        
        //res.json(codebloxfunctions);
        // req.body = {};
        // req.body.funcs = [];
        // req.body.funcs.push(codebloxfunctions[0]);
        
        //module.exports.deleteFunc(req, res, next);
    });
};

module.exports.deleteFunc = function(req, res, next) {
    getFileInDir(config.tmpDir + 'extract/' + req.params.name, function(files) {
        
        var funcFiles = req.body.funcs;
        var zip = new AdmZip();

        for(var i = 0; i < files.length; i++){
            
            var bIsFound = false;
            
            for (var j = 0; j < funcFiles.length; j++) {
                if(funcFiles[j].path === files[i]) {
                    bIsFound = true;
                    
                    var fileContent = fs.readFileSync(files[i], "utf8");
                
                    var re = new RegExp("<!--.*{CodeBlox\\+" + funcFiles[j].func + "}.*-->[^]*<!--.*{CodeBlox\\-" + funcFiles[j].func + "}.*-->", "gmi");
                    var match = re.exec(fileContent);
                    
                    if (match) {
                        fileContent = fileContent.replace(match[0], "");
                    }
                    
                    zip.addFile(path.basename(files[i]), new Buffer(fileContent));
                }
            }
            
            if (!bIsFound) {
                zip.addLocalFile(files[i]);
            }
        }
        
        zip.writeZip(config.tmpDir + 'codeblox/' + req.params.name + '.zip');
        
        //res.download(config.tmpDir + 'codeblox/' + req.params.name + '.zip');
    });
};

function getFileInDir(dir, _callback) {
    recursive(dir, function (err, files) {
        // Files is an array of filename 
        _callback(files);
    });
}