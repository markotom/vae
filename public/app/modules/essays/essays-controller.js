this.App.module('Essays', function (Essays, App, Backbone, Marionette) {
	'use strict';

  // Router
  Essays.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'essays/random': 'showRandomPost',
      'essays/:id': 'showPost'
    }
  });

  // Controller
  Essays.Controller = App.Controllers.Post.extend({
    initialize: function () {
      this.prefix = 'essays';
      this.entity = 'essay:entity';
      this.entities = 'essays:entities';
    },
    showPost: function (item) {
      this._showPost(item, Essays.Views.Show);
    },
    showRandomPost: function () {
      this._showRandomPost();
    }
  });

});
