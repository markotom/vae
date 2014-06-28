this.App.module('Header', function (Header, App) {
  'use strict';

  Header.addInitializer(function () {
    new Header.Controller({
      region: App.headerRegion
    });
  });
});
