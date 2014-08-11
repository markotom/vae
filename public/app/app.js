this.App = function (JST, Backbone, Marionette) {
  'use strict';

  // Application
  var App = new Marionette.Application({ templates: JST });

  // Add main regions
  App.addRegions({
    statusRegion: '#status',
    headerRegion: '#header',
    contentRegion: '#content',
    footerRegion: '#footer'
  });

  // Start Application
  App.on('start', function () {
    Backbone.history.start();
  });

  // Handler to get content region
  App.reqres.setHandler('default:region', function () {
    return App.contentRegion;
  });

  // Handler to get status region
  App.reqres.setHandler('status:region', function () {
    return App.statusRegion;
  });

  return App;
}(JST, Backbone, Marionette);
