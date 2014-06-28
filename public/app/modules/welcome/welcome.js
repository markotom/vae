this.App.module('Welcome', function (Welcome, App, Backbone, Marionette) {
  'use strict';

  // router
  Welcome.Router = Marionette.AppRouter.extend({
    appRoutes: {
      '': 'welcome'
    }
  });
  // initializer
  App.addInitializer(function () {
    new Welcome.Router({
      controller: new Welcome.Controller()
    });
  });
});
