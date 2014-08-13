this.App.module('Utilities', function (Utilities, App, Backbone, Marionette, $, _) {
  'use strict';

  // Add handler to get cloud (execute when dom is ready)
  App.commands.setHandler('cloud', function (options) {
    options = options || {};

    options = _.defaults(options, {
      element: '.svg-cloud',
      size: [415, 415],
      font: 'Impact',
      words: {}
    });

    options.words = _.pairs(options.words);

    if (options.words.length > 0) {

      var element, fontSize, fillColor;

      element   =  d3.select(options.element).html('');
      fontSize  = d3.scale.log().range([15, 100]);
      fillColor = d3.scale.category10();

      d3.layout.cloud()
        .size(options.size)
        .words(_.map(options.words, function (word) {
          return { text: word[0], size: word[1] }
        }))
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font(options.font)
        .fontSize(function (d) { return fontSize(d.size); })
        .text(function (d) { return d.text; })
        .on('end', function (words) {
          element.append('svg')
              .attr('width', options.size[0])
              .attr('height', options.size[1])
            .append('g')
              .attr('transform', 'translate(' + [options.size[0] >> 1, options.size[1] >> 1] + ')')
            .selectAll('text')
              .data(words)
            .enter().append('text')
              .style('font-size', function(d) { return d.size + 'px'; })
              .style('font-family', options.font)
              .style('fill', function(d, i) { return fillColor(i); })
              .attr('text-anchor', 'middle')
              .attr('transform', function(d) {
                return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
              })
              .text(function(d) { return d.text; });
        })
        .start();

    }
  });
});
