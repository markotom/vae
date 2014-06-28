this.App.module('Contents', function (Contents, App, Backbone, Marionette) {
  'use strict';

  Contents.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.collection = App.request('content:entities');
    },
    _show: function (item, ShowView) {
      var model = App.request('content:entity', item);
      model.on('sync', function () {
        App.request('default:region').show(new ShowView({ 
          model: model
        }));
      });

      App.execute('status', model);
      model.fetch({ cache: true });
    }
  });
});
