'use strict';

var config = require('./server/config'),
    express = require('express'),
    server = module.exports = express();

// Middlewares
server.use(require('body-parser').json());
server.use(require('body-parser').urlencoded({
  extended: true
}));
server.use(require('cookie-parser')());
server.use(require('method-override')());
server.use(require('express-session')({
  secret: config.secret
}));

// Template engine
server.set('view engine', 'ejs');
server.set('views', __dirname + '/public');

// Static files
server.use(express.static(__dirname + '/public'));

// Main route
server.get('/', function (req, res) {
  res.render('index');
});

// Start server
if (!module.parent) {
  server.listen(process.env.PORT || config.port);
}
