this.App.module('Entities', function (Entities, App) {
  'use strict';

  // Model
  Entities.Emblem = Entities.Model.extend({
    urlRoot: '/api/1.0/types/emblems'
  });

  // Collection
  Entities.Emblems = Entities.Collection.extend({
    url: '/api/1.0/types/emblems',
    model: Entities.Emblem
  });

  // Handler to get new instance of model
  App.reqres.setHandler('emblem:entity', function (options) {
    return new Entities.Emblem(options);
  });

  // Handler to get new instance of collection
  App.reqres.setHandler('emblems:entities', function (options) {
    return new Entities.Emblems(options);
  });
});
