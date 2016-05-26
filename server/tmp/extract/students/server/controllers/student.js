var config = require('../config/config');

var students = [];
students.push({
    name: "Liron erman"
});

students.push({
    name: "Kfir stri"
});

module.exports.getAll = function(req, res, next) {
    res.json(students);
};

module.exports.addStudent = function(req, res, next) {
    students.push({
        name: req.body.name
    });
    
    res.sendStatus(200);
};