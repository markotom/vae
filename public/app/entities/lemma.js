this.App.module('Entities', function (Entities, App, Backbone) {
  'use strict';

  // Model
  Entities.Lemma = Entities.Model.extend({
    urlRoot: '/api/1.0/types/lemmas'
  });

  // Collection
  Entities.Lemmas = Entities.Collection.extend({
    url: '/api/1.0/types/lemmas',
    model: Entities.Lemma
  });

  // Handler to get new instance of model
  App.reqres.setHandler('lemma:entity', function (options) {
    return new Entities.Lemma(options);
  });

  // Handler to get new instance of collection
  App.reqres.setHandler('lemmas:entities', function (options) {
    return new Entities.Lemmas(options);
  });
});
