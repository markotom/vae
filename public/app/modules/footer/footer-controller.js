this.App.module('Footer', function (Footer, App, Backbone, Marionette) {
  'use strict';

  // Controller
  Footer.Controller = App.Controllers.Application.extend({
    initialize: function () {
      // Set footer main view
      var footerMainView = new Footer.Views.Main();

      // Show footer main view into region
      this.show(footerMainView);
    }
  });
});
