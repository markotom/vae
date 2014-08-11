this.App.module('Utilities', function (Utilities, App, Backbone, Marionette, $, _) {
  'use strict';

  // Add method `render` in order to return template function by string
  _.extend(Marionette.Renderer, {
    render: function (template, data) {
      // Check if template index exists into jst
      if (!App.templates[template]) {
        throw 'Template "' + template + '" not found!';
      }

      return App.templates[template](data);
    }
  });
});
