'use strict';

var request = require('supertest'),
    chai = require('chai');

chai.should();

describe('Wordpress JSON API', function () {

  var post_types;

  before(function (done) {

    // Set request
    this.request = request('http://ae.filos.unam.mx/wp-json');

    // Get post types
    this.request.get('/posts/types')
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        post_types = JSON.parse(res.text);

        done();
      });
  });

  it('should exist rest api', function (done) {
    this.request.get('/')
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }

        try {
          JSON.parse(res.text);
        } catch (e) {
          return done('JSON is not valid!');
        }

        done();
      });
  });

  it('should have "content" post type', function () {
    post_types.should.have.property('content');
  });

  it('should have "types" taxonomy', function () {
    post_types.content.taxonomies.should.have.deep.property('[0].slug', 'types');
  });

});
