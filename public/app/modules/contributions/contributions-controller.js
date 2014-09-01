this.App.module('Contributions', function (Contributions, App, Backbone, Marionette) {
	'use strict';

  // Router
  Contributions.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'contributions/random': 'showRandomPost',
      'contributions/:id': 'showPost'
    }
  });

  // Controller
  Contributions.Controller = App.Controllers.Post.extend({
    initialize: function () {
      this.prefix = 'contributions';
      this.entity = 'contribution:entity';
      this.entities = 'contributions:entities';
    },
    showPost: function (item) {
      this._showPost(item, Contributions.Views.Show);
    },
    showRandomPost: function () {
      this._showRandomPost();
    }
  });

});
