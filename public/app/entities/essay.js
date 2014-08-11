this.App.module('Entities', function (Entities, App, Backbone) {
  'use strict';

  // Model
  Entities.Essay = Entities.Model.extend({
    urlRoot: '/api/1.0/types/essays'
  });

  // Collection
  Entities.Essays = Entities.Collection.extend({
    url: '/api/1.0/types/essays',
    model: Entities.Essay
  });

  // Handler to get new instance of model
  App.reqres.setHandler('essay:entity', function (options) {
    return new Entities.Essay(options);
  });

  // Handler to get new instance of collection
  App.reqres.setHandler('essays:entities', function (options) {
    return new Entities.Essays(options);
  });
});
