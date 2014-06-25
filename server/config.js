'use strict';

// Development
var development = {
  port: 3000,
  secret: 'ammel',
  mongo: {
    url: 'mongodb://alteridadyexclusiones:1234567890@kahana.mongohq.com:10096/alteridadyexclusiones'
  }
};

// Production
var production = development;

if ('production' === process.env.NODE_ENV) {
  module.exports = production;
} else {
  module.exports = development;
}
