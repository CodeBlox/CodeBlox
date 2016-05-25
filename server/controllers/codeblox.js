var fs = require('fs');
var recursive = require('recursive-readdir');
var AdmZip = require('adm-zip');
var path = require('path');


var config = require('../config/config');

module.exports.getFunc = function(req, res, next) {
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
                        path: files[i],
                        func: startFunctions[s]
                    });
                    
                    match = re.exec(fileContent);
                }
            }
        }
        
        //res.json(codebloxfunctions);
        req.body = {};
        req.body.funcs = [];
        req.body.funcs.push(codebloxfunctions[0]);
        
        module.exports.deleteFunc(req, res, next);
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
                    
                    if (match != null) {
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