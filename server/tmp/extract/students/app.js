var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./server/config/router');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

app.use('/', routes);

var port = parseInt(process.argv[2]) || 5000;

app.listen(port, function () {
  console.log("Express server started in port " + port);
});