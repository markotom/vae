this.App.module('Entities', function (Entities, App) {
  'use strict';

  // Model
  Entities.Page = Entities.Model.extend({
    urlRoot: '/api/1.0/types/pages'
  });

  // Collection
  Entities.Pages = Entities.Collection.extend({
    url: '/api/1.0/types/pages',
    model: Entities.Page
  });

  // Handler to get new instance of model
  App.reqres.setHandler('page:entity', function (options) {
    return new Entities.Page(options);
  });

  // Handler to get new instance of collection
  App.reqres.setHandler('pages:entities', function (options) {
    return new Entities.Pages(options);
  });
});
