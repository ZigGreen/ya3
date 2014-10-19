/**
 * Created with ya3.
 * User: ZigGreen
 * Date: 2014-10-17
 * Time: 08:19 AM
 */
define(['d3', 'backbone', 'utils', 'config'], function(d3, Backbone, _, c) {

    return Backbone.Model.extend({

        defaults: {
            playing: false,
            colors: c.colors,
            startColor: c.colors[c.colors.length - 1],
            random: c.randomColorize,
            meanDuration: c.meanColorizeDuration,
            variance: c.meanColorizeDuration / 16
        },

        start: function(color) {

            this.set('playing', true);
            this.get('items').style("fill", this.get('startColor'));
            this._setTransition();

            return this;
        },

        /**
         * Останавливает все зацикленные анимации,
         * сгенерированные инстансом
         **/
        stop: function() {
            this.set('playing', false);
        },

        isPlaying: function() {
            return this.get('playing');
        },

        _setTransition: function repeat() {
            var items = this.get('items');
            if(!this.isPlaying()) return;

            var duration = this.get('random') ?
                d3.random.normal(this.get('meanDuration'), this.get('variance')) :
                this.get('meanDuration');

            for(var i = 0, colors = this.get('colors'); i < colors.length; i++)
                items = items.transition()
                    .duration(duration)
                    .style("fill", colors[i]);

            items.each("end", repeat.bind(this, items));

        }

    })

});