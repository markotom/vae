(function(Backbone) {
  'use strict';

  var methods,
      _sync = Backbone.sync;

  Backbone.sync = function(method, entity, options) {
    _.defaults(options || {}, {
      beforeSend: _.bind(methods.beforeSend, entity),
      complete: _.bind(methods.complete, entity)
    });

    var sync = _sync(method, entity, options);
    if (!entity._fetch && method === 'read') {
      return sync;
    }
  };

  methods = {
    beforeSend: function() {
      return this.trigger('sync:start', this);
    },
    complete: function() {
      return this.trigger('sync:stop', this);
    }
  };

  return methods;
})(Backbone);
