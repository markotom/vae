this.App.module('Pages', function (Pages, App, Backbone, Marionette) {
  'use strict';

  // router
  Pages.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'pages/:id': 'show'
    }
  });
  // initializer
  App.addInitializer(function () {
    new Pages.Router({
      controller: new Pages.Controller()
    });
  });
});
