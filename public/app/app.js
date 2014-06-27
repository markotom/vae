// /config/backbone/sync.js
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

// app.js
this.App = function (JST, Backbone, Marionette) {
  'use strict';

  var App = new Marionette.Application({
    templates: JST
  });
  App.addRegions({
    headerRegion: '#header',
    contentRegion: '#content',
    footerRegion: '#footer'
  });
  App.on('start', function () {
    Backbone.history.start();
  });
  App.reqres.setHandler('default:region', function () {
    return App.contentRegion;
  });
  return App;
}(JST, Backbone, Marionette);

// lib/utilities/renderer.js
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

// lib/utilities/fetch.js
this.App.module('Utilities', function(Utilities, App, Backbone, Marionette, $, _) {
  'use strict';

  App.commands.setHandler('when:fetched', function (entities, callback) {
    var xhrs = _.chain([entities]).flatten().pluck('_fetch').value();
    $.when.apply($, xhrs).done(callback);
  });
});

// lib/utilities/spinner.js
this.App.module('Utilities', function (Utilities, App, Backbone, Marionette) {
  'use strict';

  App.commands.setHandler('spinner', function (entity) {
    entity.on('sync:start', function () {
      App.request('default:region').show(new Marionette.ItemView({
        template: 'utilities/spinner'
      }));
    });
  });
});

// modules/header/header.js
this.App.module('Header', function (Header, App) {
  'use strict';

  Header.addInitializer(function () {
    new Header.Controller({
      region: App.headerRegion
    });
  });
});

// modules/header/controller.js
this.App.module('Header', function (Header, App, Backbone, Marionette) {
  'use strict';

  Header.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.options.region.show(new Header.Views.Main());
    }
  });
});

// modules/header/views.js
this.App.module('Header', function (Header, App, Backbone, Marionette) {
  'use strict';

  Header.Views = {};
  Header.Views.Main = Marionette.LayoutView.extend({
    template: 'header'
  });
});

// modules/footer/footer.js
this.App.module('Footer', function (Footer, App) {
  'use strict';

  Footer.addInitializer(function () {
    new Footer.Controller({
      region: App.footerRegion
    });
  });
});

// modules/footer/controller.js
this.App.module('Footer', function (Footer, App, Backbone, Marionette) {
  'use strict';

  Footer.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.options.region.show(new Footer.Views.Main());
    }
  });
});

// modules/welcome/welcome.js
this.App.module('Welcome', function (Welcome, App, Backbone, Marionette) {
  'use strict';

  // router
  Welcome.Router = Marionette.AppRouter.extend({
    appRoutes: {
      '': 'welcome'
    }
  });
  // initializer
  App.addInitializer(function () {
    new Welcome.Router({
      controller: new Welcome.Controller()
    });
  });
});

// modules/footer/views.js
this.App.module('Footer', function (Footer, App, Backbone, Marionette) {
  'use strict';

  Footer.Views = {};
  Footer.Views.Main = Marionette.ItemView.extend({
    template: 'footer'
  });
});

// modules/welcome/controller.js
this.App.module('Welcome', function (Welcome, App, Backbone, Marionette) {
  'use strict';

  Welcome.Controller = Marionette.Controller.extend({
    initialize: function () {
      this.region = App.request('default:region');
    },
    welcome: function () {
      this.region.show(new Welcome.Views.Layout());
    }
  });
});

// modules/welcome/views.js
this.App.module('Welcome', function (Welcome, App, Backbone, Marionette) {
  'use strict';

  Welcome.Views = {};
  Welcome.Views.Layout = Marionette.LayoutView.extend({
    template: 'welcome'
  });
});

// modules/contents/contents.js
this.App.module('Contents', function (Contents, App, Backbone, Marionette) {
  'use strict';

  // router
  Contents.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'pages/:id': 'showPages',
      'lemas/:id': 'showLemas'
    }
  });
  // initializer
  App.addInitializer(function () {
    new Contents.Router({
      controller: new Contents.Controller()
    });
  });
});

// modules/contents/controller.js
this.App.module('Contents', function (Contents, App, Backbone, Marionette) {
  'use strict';

  Contents.Controller = Marionette.Controller.extend({
    initialize: function () {
      App.request('content:entities');
    },
    showPages: function (item) {
      this._show(item, App.module('Pages').Views.Show);
    },
    showLemas: function (item) {
      this._show(item, App.module('Lemas').Views.Show);
    },
    _show: function (item, ShowView) {
      var model = App.request('content:entity', item);
      model.on('sync', function () {
        App.request('default:region').show(new ShowView({ 
          model: model
        }));
      });
    }
  });
});

// modules/contents/entities.js
this.App.module('Entities', function (Entities, App, Backbone) {
  'use strict';

  Entities.Content = Backbone.Model.extend({
    urlRoot: 'http://ae.filos.unam.mx/wp-json/posts',
    url: function () {
      return this.urlRoot + '/' + this.attributes.id + '?_jsonp=?';
    },
    initialize: function () {
      App.execute('spinner', this);
      this.fetch();
    }
  });
  Entities.Contents = Backbone.Collection.extend({
    url: 'http://ae.filos.unam.mx/wp-json/posts',
    model: Entities.Content
  });
  App.reqres.setHandler('content:entity', function (item) {
    return new Entities.Content({ id: item });
  });
  App.reqres.setHandler('content:entities', function () {
    return new Entities.Contents();
  });
});

// modules/pages/views.js
this.App.module('Pages', function (Pages, App, Backbone, Marionette) {
  'use strict';

  Pages.Views = {};
  Pages.Views.Show = Marionette.ItemView.extend({
    template: 'pages/item'
  });
});

// modules/lemas/views.js
this.App.module('Lemas', function (Lemas, App, Backbone, Marionette) {
  'use strict';

  Lemas.Views = {};
  Lemas.Views.Show = Marionette.ItemView.extend({
    template: 'lemas/item'
  });
});
