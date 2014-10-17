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
            random: c.randomColorize,
            meanDuration: c.meanColorizeDuration,
            variance: c.meanColorizeDuration / 16      
        },

        start: function() {
            this.set('playing', true);
            return this;
        },

        stop: function() {
            this.set('playing', false);
        },

        isPlaying: function() {
            return this.get('playing');
        },

        transitionGenerator: function() {
            var control = this;

            return function() {

                var circle = d3.select(this);

                (function repeat() {

                    if(!control.isPlaying()) return;

                    var duration = control.get('random') ?
                        d3.random.normal(control.get('meanDuration'), control.get('variance')) :
                        control.get('meanDuration');
                    
                    for(var i = 0, colors = control.get('colors'); i < colors.length; i++)
                        circle = circle.transition()
                            .duration(duration)
                            .style("fill", colors[i]);

                    circle.each("end", repeat);
                    
                })();
            }
        }


    })

});