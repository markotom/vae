'use strict';

var config = require('./server/config'),
    express = require('express'),
    server = module.exports = express(),
    WP = require('wordpress-rest-api'),
    keyword_extractor = require('keyword-extractor'),
    wuzzy = require('wuzzy'),
    _ = require('lodash');

// Wordpress Rest API (client)
// Not use with auth on production
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

        // Get words for each content
        data.forEach(function (d) {
          // Using stop words (spanish)
          // http://en.wikipedia.org/wiki/Stop_words
          var words = keyword_extractor.extract(d.content, {
            language: 'spanish',
            return_changed_case: true
          });

          d.words = _.chain(words).countBy().value();
        });

        // Get needles to search in a haystack
        var needles = _.map(data, function (c) {
          var needle = { ID: c.ID, title: c.title };

          if (c.terms.types && c.terms.types[0]) {
            needle.type = c.terms.types[0].slug;
          }

          return needle;
        });

        // Generate relations between contents
        // http://en.wikipedia.org/wiki/Approximate_string_matching
        needles.forEach(function (needle) {
          // Search needle in each content
          data.forEach(function (object, index) {
            // Compare distance for each word
            _.keys(object.words).forEach(function (word) {
              // Using Jaro-Winkler algorithm to measure the distance
              // http://en.wikipedia.org/wiki/Jaro%E2%80%93Winkler_distance
              var distance = wuzzy.jarowinkler(needle.title, word);

              // Replace if distance is more than 0.8
              if (distance > 0.8) {
                // Search if word has no link yet
                var pattern = new RegExp('(?!<.*?)\\b(' + word + ')\\b(?![^<>]*?(</a>|>))', 'gi');

                // Replace content with pattern
                data[index].content = object.content.replace(pattern, function (word) {
                  return '<a href="#/'+ needle.type +'/' + needle.ID + '">'+ word +'</a>';
                });
              }
            });
          });
        });

        // Group by types (is there a faster module than Lodash?)
        data = _.groupBy(data, function (content) {
          var types = content.terms.types;

          if (types && types[0]) {
            return types[0].slug;
          }
        });

        // Set content by types
        server.set('contents', data);

        console.log('The content has been processed!');
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

// Contents (by id)
server.get('/api/1.0/types/:type/:id', function (req, res) {
  var contents = server.get('contents'),
      content = _.where(contents[req.params.type], {
        'ID': parseInt(req.params.id, 10)
      });

  res.json(content[0]);
});

// Contents (by type)
['contributions', 'emblems', 'essays', 'studies', 'lemmas', 'pages'].forEach(function (slug) {
  server.get('/api/1.0/types/' + slug, function (req, res) {
    var contents = server.get('contents');
    res.json(contents[slug]);
  });
});


// Start server
if (!module.parent) {
  server.listen(process.env.PORT || config.port);
}
