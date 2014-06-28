this.App.module('Entities', function (Entities, App, Backbone) {
  'use strict';

  var _models = [];

  Entities.Content = Backbone.Model.extend({
    urlRoot: 'http://ae.filos.unam.mx/wp-json/posts',
    url: function () {
      return this.urlRoot + '/' + this.attributes.id + '?_jsonp=?';
    }
  });
  Entities.Contents = Backbone.Collection.extend({
    url: function () {
      var url = 'http://ae.filos.unam.mx/wp-json/posts',
          qs = '?type=content&page=' + this.page + '&_jsonp=?';

      return url + qs;
    },
    model: Entities.Content,
    initialize: function (options) {
      options = options || {};
      this.page = options.page || 1;
    },
    fetch: function (options) {
      _models = this.page > 1 ? _models : [];
      Backbone.Collection.prototype.fetch.call(this, options);
    },
    parse: function (models) {
      this._collection = App.request('content:entities', this.page + 1);

      if (models.length > 0) {
        _models.push(models);
        this._collection.fetch({ cache: true });
      } else {
        App.vent.trigger('when:fetchedAll', _.flatten(_models));
      }

      return models;
    }
  });
  App.reqres.setHandler('content:entity', function (item) {
    return new Entities.Content({ id: item });
  });
  App.reqres.setHandler('content:entities', function (page) {
    if (page) {
      return new Entities.Contents({ page: page });
    }

    App.collections = App.collections || {};
    App.collections.contents = App.collections.contents || new Entities.Contents();

    return App.collections.contents;
  });
});
