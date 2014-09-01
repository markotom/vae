this.App.module('Utilities', function (Utilities, App, Backbone, Marionette, $, _) {
  'use strict';

  // Add handler to get cloud (execute when dom is ready)
  App.commands.setHandler('cloud', function (options) {
    options = options || {};

    options = _.defaults(options, {
      element: '.svg-cloud',
      size: [415, 415],
      font: 'Helvetica, Arial, sans-serif',
      words: []
    });

    options.words = options.words.slice(0, 100);

    if (options.words.length > 0) {

      var element, fontSize, fillColor;

      element   = d3.select(options.element).html('');
      fontSize  = d3.scale.log().domain([
      	_.min(options.words, function(word) { return word.size; }).size,
      	_.max(options.words, function(word) { return word.size; }).size
      ]).range([20, 90]);
      fillColor = d3.scale.category10();

      d3.layout.cloud()
        .size(options.size)
        .words(options.words)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font(options.font)
        .fontSize(function (d) { return fontSize(d.size); })
        .fontWeight('bold')
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
              .style('font-weight', 'bold')
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
