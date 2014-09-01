this.App.module('Emblems', function (Emblems, App, Backbone, Marionette) {
	'use strict';

  // Router
  Emblems.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'emblems/random': 'showRandomPost',
      'emblems/:id': 'showPost'
    }
  });

  // Controller
  Emblems.Controller = App.Controllers.Post.extend({
    initialize: function () {
      this.prefix = 'emblems';
      this.entity = 'emblem:entity';
      this.entities = 'emblems:entities';
    },
    showPost: function (item) {
      this._showPost(item, Emblems.Views.Show);
    },
    showRandomPost: function () {
      this._showRandomPost();
    }
  });

});
