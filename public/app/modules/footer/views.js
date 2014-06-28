this.App.module('Footer', function (Footer, App, Backbone, Marionette) {
  'use strict';

  Footer.Views = {};
  Footer.Views.Main = Marionette.ItemView.extend({
    template: 'footer'
  });
});
