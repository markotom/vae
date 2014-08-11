this.App.module('Entities', function (Entities, App, Backbone) {
  'use strict';

  // Model
  Entities.Study = Entities.Model.extend({
    urlRoot: '/api/1.0/types/studies'
  });

  // Collection
  Entities.Studies = Entities.Collection.extend({
    url: '/api/1.0/types/studies',
    model: Entities.Study
  });

  // Handler to get new instance of model
  App.reqres.setHandler('study:entity', function (options) {
    return new Entities.Study(options);
  });

  // Handler to get new instance of collection
  App.reqres.setHandler('studies:entities', function (options) {
    return new Entities.Studies(options);
  });
});
