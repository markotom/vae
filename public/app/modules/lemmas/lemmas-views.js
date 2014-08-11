this.App.module('Lemmas', function (Lemmas, App, Backbone, Marionette) {
  'use strict';

  // Lemmas Views
  Lemmas.Views = {};

  // Lemmas Show View
  Lemmas.Views.Show = Marionette.ItemView.extend({
    template: 'lemmas/item'
  });

});
