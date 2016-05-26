var config = require('../config/config');
var slash = require('slash');

module.exports.getZip = function(req, res, next) {
    if (req.params.key) {
        res.download(slash(config.tmpDir + 'codeblox/' + req.params.key + '.zip'));
    } else {
        res.sendStatus(400);
    }
};