this.App.module('Footer', function (Footer, App) {
  'use strict';

  // Initialize module
  Footer.addInitializer(function () {
    // Set controller instance
    new Footer.Controller({ region: App.footerRegion });
  });
});
