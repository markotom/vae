this.App.module('Welcome', function (Welcome, App, Backbone, Marionette) {
  'use strict';

  Welcome.Views = {};
  Welcome.Views.Layout = Marionette.LayoutView.extend({
    template: 'welcome'
  });
});
