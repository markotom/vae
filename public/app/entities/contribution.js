this.App.module('Entities', function (Entities, App, Backbone) {
  'use strict';

  // Model
  Entities.Contribution = Entities.Model.extend({
    urlRoot: '/api/1.0/types/contributions'
  });

  // Collection
  Entities.Contributions = Entities.Collection.extend({
    url: '/api/1.0/types/contributions',
    model: Entities.Contribution
  });

  // Handler to get new instance of model
  App.reqres.setHandler('contribution:entity', function (options) {
    return new Entities.Contribution(options);
  });

  // Handler to get new instance of collection
  App.reqres.setHandler('contributions:entities', function (options) {
    return new Entities.Contributions(options);
  });
});
