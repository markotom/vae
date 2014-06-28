this.App.module('Footer', function (Footer, App) {
  'use strict';

  Footer.addInitializer(function () {
    new Footer.Controller({
      region: App.footerRegion
    });
  });
});
