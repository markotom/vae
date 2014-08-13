this.App.module('Studies', function (Studies, App, Backbone, Marionette) {
  'use strict';

  // Studies Views
  Studies.Views = {};

  // Studies Show View
  Studies.Views.Show = App.Views.Post.Show.extend();

});
