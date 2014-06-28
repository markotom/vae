this.App.module('Welcome', function (Welcome, App, Backbone, Marionette) {
  'use strict';

  Welcome.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.region = App.request('default:region');
    },
    welcome: function () {
      this.region.show(new Welcome.Views.Layout());
    }
  });
});
