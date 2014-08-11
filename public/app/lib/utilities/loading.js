this.App.module('Utilities', function (Utilities, App, Backbone, Marionette) {
  'use strict';

  // Add handler to show or hide loading message
  App.commands.setHandler('loading', function (entity) {
    // Show view if have not been synced
    entity.on('sync:start', function () {
      App.request('status:region').show(new Marionette.ItemView({
        template: 'utilities/status'
      }));
    });

    // Hide view if have been synced
    entity.on('sync:stop', function () {
      App.request('status:region').empty();
    });
  });
});
