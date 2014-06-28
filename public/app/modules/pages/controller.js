this.App.module('Pages', function (Pages, App) {
  'use strict';

  Pages.Controller = App.module('Contents').Controller.extend({
    show: function (item) {
      this._show(item, Pages.Views.Show);
    }
  });
});
