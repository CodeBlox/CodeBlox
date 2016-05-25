var fs = require('fs');
var recursive = require('recursive-readdir');

var config = require('../config/config');

module.exports.getFunc = function(req, res, next) {
    getFileInDir('C:\\Users\\Liron\\Desktop\\Projects\\CodeBlox\\server\\tmp\\test', function(files) {
        
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
        
        res.json(codebloxfunctions);
    });
};

function getFileInDir(dir, _callback) {
    recursive(dir, function (err, files) {
        // Files is an array of filename 
        _callback(files);
    });
}