this.App.module('Lemas', function (Lemas, App, Backbone, Marionette) {
  'use strict';

  // router
  Lemas.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'lemas/azar': 'azar',
      'lemas/:id': 'show'
    }
  });
  // initializer
  App.addInitializer(function () {
    new Lemas.Router({
      controller: new Lemas.Controller()
    });
  });
});
