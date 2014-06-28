this.App = function (JST, Backbone, Marionette) {
  'use strict';

  var App = new Marionette.Application({
    templates: JST
  });
  App.addRegions({
    statusRegion: '#status',
    headerRegion: '#header',
    contentRegion: '#content',
    footerRegion: '#footer'
  });
  App.on('start', function () {
    Backbone.history.start();
  });
  App.reqres.setHandler('default:region', function () {
    return App.contentRegion;
  });
  App.reqres.setHandler('status:region', function () {
    return App.statusRegion;
  });
  return App;
}(JST, Backbone, Marionette);
