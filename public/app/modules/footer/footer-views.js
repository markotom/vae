this.App.module('Footer', function (Footer, App, Backbone, Marionette) {
  'use strict';

  // Footer Views
  Footer.Views = {};

  // Footer Main View
  Footer.Views.Main = Marionette.ItemView.extend({ template: 'footer' });
});
