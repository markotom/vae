'use strict';

var config = require('./server/config'),
    express = require('express'),
    server = module.exports = express(),
    WP = require('wordpress-rest-api'),
    lodash = require('lodash');

// Wordpress Rest API (client)
// Be careful if use auth on production
var wp = new WP({ endpoint: 'http://ae.filos.unam.mx/wp-json' });

// Middlewares
server.use(require('body-parser').json());
server.use(require('body-parser').urlencoded({
  extended: true
}));
server.use(require('cookie-parser')());
server.use(require('method-override')());
server.use(require('express-session')({ secret: config.secret }));

// Template engine
server.set('view engine', 'ejs');
server.set('views', __dirname + '/public');

// Static files
server.use(express.static(__dirname + '/public'));

// Get data from Wordpress
var getDataFromWordpress = function () {
  console.log('Get data from Wordpress without involving http requests...');

  // Connect to Wordpress API
  wp.posts()
    .type('content')
    .filter('posts_per_page', -1)
    .get(function (err, data) {
      if (!err) {

        console.log('Found ' + data.length + ' contents');

        // Group by types (is there a faster module than Lodash?)
        data = lodash.groupBy(data, function (content) {
          var slug,
              types = content.terms.types;

          if (types && types[0]) {

            switch (types[0].slug) {
              case 'contribuciones-al-debate': slug = 'contributions'; break;
              case 'emblemas': slug = 'emblems'; break;
              case 'ensayos': slug = 'essays'; break;
              case 'estudios-de-vocabulario': slug = 'studies'; break;
              case 'lemas': slug = 'lemmas'; break;
              case 'paginas': slug = 'pages'; break;

              default: slug = types[0].slug;
            }

            return slug;
          }
        });

        // Set content by types
        server.set('contents', data);
      }
    });
};

// Get data from Wordpress hourly
setInterval(getDataFromWordpress, 1 * 60 * 60 * 1000);
getDataFromWordpress();


// Main route
server.get('/', function (req, res) {
  res.render('index');
});


// Endpoints
//

// Contents (all types)
server.get('/api/1.0/types', function (req, res) {
  res.json(server.get('contents'));
});

// Contents (by type)
['contributions', 'emblems', 'essays', 'studies', 'lemmas', 'pages'].forEach(function (slug) {
  server.get('/api/1.0/types/' + slug, function (req, res) {
    var contents = server.get('contents');
    res.json(contents[slug]);
  });
});

// Contents (by id)
server.get('/api/1.0/types/:type/:id', function (req, res) {
  var contents = server.get('contents'),
      content = lodash.where(contents.lemas, { 'ID': 445 });

  res.json(content[0]);
});


// Start server
if (!module.parent) {
  server.listen(process.env.PORT || config.port);
}
