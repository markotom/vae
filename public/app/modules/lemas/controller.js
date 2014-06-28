this.App.module('Lemas', function (Lemas, App, Backbone) {
  'use strict';

  Lemas.Controller = App.module('Contents').Controller.extend({
    azar: function () {
      App.vent.once('when:fetchedAll', function (models) {
        models = _.filter(models, function (model) {
          return model.terms.types[0].slug === 'lemas';
        });

        Backbone.history.navigate(
          '#/lemas/' + models[_.random(0, models.length - 1)].ID);
      });
      App.execute('status', this.collection);
      this.collection.fetch({ cache: true });
    },
    show: function (item) {
      this._show(item, Lemas.Views.Show);
    }
  });
});
