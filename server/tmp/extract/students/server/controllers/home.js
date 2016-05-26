var config = require('../config/config');

module.exports.index = function(req, res, next) {
    res.sendFile(config.viewDir + 'index.html');
};