/**
 * Created with ya3.
 * Модель точки
 * User: ZigGreen
 * Date: 2014-10-16
 * Time: 11:45 AM
 */
define(['backbone', 'utils', 'config'], function(Backbone, _, c) {
    var Circle = {

        constructor: function() {
            Backbone.Model.apply(this, arguments);
            // Возвращаем точки, вылетевшие за границу
            this
                .on('change:x', function(node, x) {
                    if(x < 0 && this.vx < 0) {
                        this.vx *= -1;
                    } else if(x > this.get('field').width && this.vx > 0) {
                        this.vx *= -1;
                    }
                })
                .on('change:y', function(node, y) {
                    if(y < 0 && this.vy < 0) {
                        this.vy *= -1;

                    } else if(y > this.get('field').height && this.vy > 0) {
                        this.vy *= -1;
                    }
                })
        },
        
        // Для увеличения производительности в некоторых местах 
        // возможно использовать "разряженное" оповещение о событиях
        throttleTrigger: _.throttle(Backbone.Model.prototype.trigger,1),

        defaults: function() {
            return {
                vx: Math.random() * c.speedFactor - 1,
                vy: Math.random() * c.speedFactor - 1,
                radius: Math.random() * c.radiusFactor
            }
        },
        doStep: function(delta) {

            this.x += (delta || this.vx);
            this.y += (delta || this.vy);

        },
        /**
         * Функция-фабрика для обработки сталкновений
         * @returns функция ассоциированная с узлом
         **/
        collide: function() {
            var node = this,
                r = node.radius,
                nx1 = node.x - r,
                nx2 = node.x + r,
                ny1 = node.y - r,
                ny2 = node.y + r;
            return function(quad, x1, y1, x2, y2) {
                if(quad.point && (quad.point !== node)) {
                    var x = node.x - quad.point.x,
                        y = node.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = node.radius + quad.point.radius;
                    if(l < r) {
                        l = (l - r) / l * .5;
                        node.x -= x *= l;
                        node.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            };
        }
    };
    // данные алиасы нужны для корректной работы модели с d3
    ['vx', 'vy', 'radius', 'fixed'].forEach(function(prop) {
        _.createAlias(Circle, prop);
    });
    ['x', 'y', 'px', 'py'].forEach(function(prop) {
        _.createAlias(Circle, prop, {throttle: c.enableThrottle});
    });
    
    return Backbone.Model.extend(Circle)

});