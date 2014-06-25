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
          return done('JSON is not a valid!');
        }

        done();
      });
  });

  it('should have "lema" post type', function () {
    post_types.should.have.property('lema');
  });

  it('should have "emblema" post type', function () {
    post_types.should.have.property('emblema');
  });

  it('should have "estudio" post type', function () {
    post_types.should.have.property('estudio');
  });

  it('should have "pregunta" post type', function () {
    post_types.should.have.property('pregunta');
  });

  it('should have "ensayo" post type', function () {
    post_types.should.have.property('ensayo');
  });

});