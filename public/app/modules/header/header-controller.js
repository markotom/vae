this.App.module('Header', function (Header, App) {
  'use strict';

  // Controller
  Header.Controller = App.Controllers.Application.extend({
    initialize: function () {
      // Set header main view
      var headerMainView = new Header.Views.Main();

      // Show header main view into region
      this.show(headerMainView);
    }
  });
});
