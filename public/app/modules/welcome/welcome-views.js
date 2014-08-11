this.App.module('Welcome', function (Welcome, App, Backbone, Marionette) {
  'use strict';

  // Welcome Views
  Welcome.Views = {};

  // Welcome Main View
  Welcome.Views.Main = Marionette.LayoutView.extend({
    template: 'welcome'
  });
});
