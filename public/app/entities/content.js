this.App.module('Entities', function (Entities, App, Backbone) {
  'use strict';

  // Model
  Entities.Content = Backbone.Model.extend({
    urlRoot: '/api/1.0/types'
  });

  // Collection
  Entities.Contents = Backbone.Collection.extend({
    url: '/api/1.0/types',
    model: Entities.Content
  });

  // Handler to get new instance of model
  App.reqres.setHandler('content:entity', function (options) {
    return new Entities.Content(options);
  });

  // Handler to get new instance of collection
  App.reqres.setHandler('content:entities', function (options) {
    return new Entities.Contents(options);
  });
});
