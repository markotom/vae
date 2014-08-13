this.App.module('Lemmas', function (Lemmas, App, Backbone, Marionette) {
  'use strict';

  // Lemmas Views
  Lemmas.Views = {};

  // Lemmas Show View
  Lemmas.Views.Show = App.Views.Post.Show.extend();

});
