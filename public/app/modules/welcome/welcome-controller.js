this.App.module('Welcome', function (Welcome, App, Backbone, Marionette) {
  'use strict';

  // Router
  Welcome.Router = Marionette.AppRouter.extend({
    appRoutes: { '': 'welcome' }
  });

  // Controller
  Welcome.Controller = App.Controllers.Application.extend({
    welcome: function () {
      // Set welcome main view
      var welcomeMainView = new Welcome.Views.Main();

      // Show welcome main view into region
      this.show(welcomeMainView);
    }
  });
});
