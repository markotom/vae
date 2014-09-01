this.App.module('Pages', function (Pages, App, Backbone, Marionette) {
	'use strict';

  // Router
  Pages.Router = Marionette.AppRouter.extend({
    appRoutes: { 'pages/:id': 'showPage' }
  });

  // Controller
  Pages.Controller = App.Controllers.Application.extend({
    showPage: function (item) {
      // Get model
      var model = App.request('page:entity', { id: item });

      // Show view when sync is done
      model.on('sync', function () {
        this.show(new Pages.Views.Show({ model: model }));
      }, this);

      // Show loading message
      App.execute('loading', model);

      // Fetch model
      model.fetch();
    }
  });

});
