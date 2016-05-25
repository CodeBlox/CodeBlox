var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var schema = new Schema({
    name: String,
    functions: [{
        name: String,
        file: String    
    }]
});

module.exports = mongoose.model('Project', schema);