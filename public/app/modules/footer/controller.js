this.App.module('Footer', function (Footer, App, Backbone, Marionette) {
  'use strict';

  Footer.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.options.region.show(new Footer.Views.Main());
    }
  });
});
