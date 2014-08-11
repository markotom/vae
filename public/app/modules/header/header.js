this.App.module('Header', function (Header, App) {
  'use strict';

  // Initialize module
  Header.addInitializer(function () {
    // Set controller instance
    new Header.Controller({ region: App.headerRegion });
  });
});
