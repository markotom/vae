this.App.module('Utilities', function (Utilities, App, Backbone, Marionette, _) {
  'use strict';

  _.extend(Marionette.Renderer, {
    render: function (template, data) {
      if (!App.templates[template]) {
        throw 'Template "' + template + '" not found!';
      }
      return App.templates[template](data);
    }
  });
});
