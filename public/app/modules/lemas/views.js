this.App.module('Lemas', function (Lemas, App, Backbone, Marionette) {
  'use strict';

  Lemas.Views = {};
  Lemas.Views.Show = Marionette.ItemView.extend({
    template: 'lemas/item'
  });
});
