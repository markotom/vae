this.App.module('Utilities', function (Utilities, App, Backbone, Marionette, $, _) {
  'use strict';

  // Add handler to verify whether entities have been fetched
  App.commands.setHandler('when:fetched', function (entities, callback) {
    var xhrs = _.chain([entities]).flatten().pluck('_fetch').value();
    $.when.apply($, xhrs).done(callback);
  });
});
