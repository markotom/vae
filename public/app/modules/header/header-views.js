this.App.module('Header', function (Header, App, Backbone, Marionette) {
  'use strict';

  // Header Views
  Header.Views = {};

  // Header Main View
  Header.Views.Main = Marionette.LayoutView.extend({
    template: 'header',
    regions: {
      search: '#search'
    },
    initialize: function () {
      this.collection = App.request('content:entities');

      this.listenTo(this.collection, 'sync', function (collection, models) {
        this.search.show(new Header.Views.Search({
          models: models
        }));
      });

      this.collection.fetch();
    }
  });

  // Header Search View
  Header.Views.Search = Marionette.ItemView.extend({
    template: 'search',
    serializeData: function () {
      return this.options;
    },
    onShow: function () {
      this.select = $('.chosen-select');

      this.select.chosen({
        no_results_text: 'No se encontró ningún resultado con'
      });

      this.select.change(function () {
        Backbone.history.navigate($(this).val());
      });

      this.setSelected();
      Backbone.history.on('route', this.setSelected, this);
    },
    setSelected: function () {
      var current = this.select.find('option[value$="'+ Backbone.history.fragment +'"]');

      $('.chosen-select option').prop('selected', false);

      if (current) {
        current.prop('selected', true)​​​;
      }

      this.select.trigger('chosen:updated');
    }
  });
});
