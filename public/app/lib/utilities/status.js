this.App.module('Utilities', function (Utilities, App, Backbone, Marionette) {
  'use strict';

  App.commands.setHandler('status', function (entity) {
    entity.on('sync:start', function () {
      App.request('status:region').show(new Marionette.ItemView({
        template: 'utilities/status'
      }));
    });
    entity.on('sync:stop', function () {
      App.request('status:region').empty();
    });
  });
});
