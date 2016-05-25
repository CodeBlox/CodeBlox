var fs = require('fs');
var recursive = require('recursive-readdir');
var AdmZip = require('adm-zip');
var path = require('path');
var randomstring = require("randomstring");

var config = require('../config/config');
var Project = require('../models/project.db');

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
                        file: files[i].replace(config.tmpDir + 'extract\\' + req.params.name + '\\', ''),
                        name: startFunctions[s]
                    });
                    
                    match = re.exec(fileContent);
                }
            }
        }
        
        Project({
            name: req.params.name,
            functions: codebloxfunctions
        }).save(function(err, pro) {
            if (err) throw err;

            console.log('Projcet created!');
            res.sendStatus(200);
        });
    });
};

module.exports.deleteFunc = function(req, res, next) {
    if (!req.params.name) {
        res.status(400).json({ error: 'No project name given'});
    } else {
        getFileInDir(config.tmpDir + 'extract/' + req.params.name, function(files) {
            
            var selectedFuncs = req.body.funcs;
            
            if (!selectedFuncs){
                selectedFuncs = [];
            }
            
            var zip = new AdmZip();

            for(var i = 0; i < files.length; i++){
                files[i] = files[i].replace(config.tmpDir + 'extract\\' + req.params.name + '\\', '')
            }
            
            Project.findOne({name: req.params.name}, function(err, project) {
                if (err) throw err;
                
                var functions = [];
                for(var i = 0; i < project.functions.length; i++){
                    if (selectedFuncs.indexOf(project.functions[i].name) != -1) {
                        functions.push({
                            name: project.functions[i].name,
                            file: project.functions[i].file
                        });
                    }
                }
                
                for(var i = 0; i < files.length; i++){
                    
                    var bIsFound = false;
                    
                    for (var j = 0; j < functions.length; j++) {
                        if(functions[j].file === files[i]) {
                            bIsFound = true;
                            
                            var fileContent = fs.readFileSync(config.tmpDir + 'extract\\' + req.params.name + '\\' + files[i], "utf8");
                        
                            var re = new RegExp("<!--.*{CodeBlox\\+" + functions[j].name + "}.*-->[^]*<!--.*{CodeBlox\\-" + functions[j].name + "}.*-->", "gmi");
                            var match = re.exec(fileContent);
                            
                            if (match) {
                                fileContent = fileContent.replace(match[0], "");
                            }
                            
                            zip.addFile(functions[j].file, new Buffer(fileContent));
                        }
                    }
                    
                    if (!bIsFound) {
                        zip.addLocalFile(config.tmpDir + 'extract\\' + req.params.name + '\\' + files[i],
                                        files[i].replace(config.tmpDir + 'extract\\' + req.params.name + '\\', ''));
                    }
                }
                var uid = randomstring.generate(5);
                zip.writeZip(config.tmpDir + 'codeblox/' + req.params.name + '-' + uid + '.zip');
                
                res.download(config.tmpDir + 'codeblox/' + req.params.name + '-' + uid + '.zip');
            });
        });
    }
};

function getFileInDir(dir, _callback) {
    recursive(dir, function (err, files) {
        // Files is an array of filename 
        _callback(files);
    });
}