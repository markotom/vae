this.App.module('Controllers', function (Controllers, App, Backbone, Marionette, $, _) {
  'use strict';

  Controllers.Application = Marionette.Controller.extend({
    constructor: function (options) {
      options = options || {};

      this.region = options.region || App.request('default:region');

      Marionette.Controller.prototype.constructor.apply(this, arguments);
    },
    show: function (view, options) {
      options = options || {};

      options = _.defaults(options, {
        region: this.region
      });

      while (view.getView) {
        view = view.getView();
      }

      this.setView(view);

      return this._manageView(view, options);
    },
    getView: function () {
      return this._view;
    },
    setView: function (view) {
      if (this._view) {
        return;
      }

      this._view = view;
      return this.listenTo(view, 'destroy', this.destroy);
    },
    _manageView: function (view, options) {
      return options.region.show(view);
    }
  });
});
