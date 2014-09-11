'use strict';

var config = require('./server/config'),
    express = require('express'),
    server = module.exports = express(),
    WP = require('wordpress-rest-api'),
    keyword_extractor = require('keyword-extractor'),
    wuzzy = require('wuzzy'),
    Retext = require('retext'),
    search = require('retext-search'),
    retext = new Retext().use(search),
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
            return_changed_case: false
          });

          d.words = _.chain(words).countBy().pairs().map(function (word) {
            return { text: word[0], size: word[1] };
          }).sortBy(function (word) {
            return -word.size;
          }).value();
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
            _.pluck(object.words, 'text').forEach(function (word) {
              // Using n-gram to measure the distance
              // http://en.wikipedia.org/wiki/N-gram
              var distance = wuzzy.ngram(needle.title, word);

              // Replace if distance is more than 0.6
              if (distance > 0.6) {
                // Search if word has no link yet
                var pattern = new RegExp('(?!<a.*?)\\b(' + word + ')\\b(?![^<>]*?(</a>|>))', 'gi');

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

// Too slow, can you do it faster?
server.get('/api/1.0/search', function (req, res) {
  var posts = [];

  if (req.query.q) {
    // Get contents
    var contents = server.get('contents');
        contents = _.chain(contents).pluck().flatten().value();

    // Remove symbols except letters
    var needle = req.query.q.replace(/[-'`~!@#$%^&*()_|+=¿?;:'",.<>\{\}\[\]\\\/]/gi, '');
    // Extract keywords with stop words
    var keywords = keyword_extractor.extract(needle, { language: 'spanish' });

    // For each content (post)
    contents.forEach(function (post) {
      // Strip html tags of post content
      var content = post.content.replace(/<[^>]+>/ig, '');
      // Parse with retext
      content = retext.parse(content);
      // Search all keywords
      var matches = content.searchAll(keywords);

      if (matches.length > 0) {
        // Matches sort by length
        matches = _.sortBy(matches, function (match) {
          return -match.matches.length;
        });

        var _post = {
          id: post.ID,
          title: post.title,
          matches: matches[0]
        };

        if (post.terms.types && post.terms.types[0]) {
          _post.url = '#/' + post.terms.types[0].slug + '/' + post.ID;
        }

        // Push object into array posts
        posts.push(_post);
      }
    });

    // Array format
    posts = _.chain(posts)
      .groupBy('id')
      .map(function (post) {
        return {
          id: post[0].id,
          title: post[0].title,
          url: post[0].url,
          matches: _.map(post, function (p) {
            return p.matches.node.toString();
          }),
          size: _.reduce(post, function (sum, p) {
            return sum + p.matches.matches.length;
          }, 0)
        };
      })
      .sortBy(function (post) {
        return -post.size;
      })
      .value();

  }

  res.json(posts);
});

// Start server
if (!module.parent) {
  server.listen(process.env.PORT || config.port);
}
