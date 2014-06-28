this.App.module('Header', function (Header, App, Backbone, Marionette) {
  'use strict';

  Header.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.options.region.show(new Header.Views.Main());
    }
  });
});
