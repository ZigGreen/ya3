/**
 * Created with ya3.
 * Набор полезных утилит
 * User: ZigGreen
 * Date: 2014-10-16
 * Time: 11:32 AM
 */
define(['underscore'], function(_) {
    var ObjProto = Object.prototype,
        Obj = Object,
        getOwnPropertyNames = Obj.getOwnPropertyNames,
        defineProperty = Obj.defineProperty || function(obj, prop, desc) {
            obj[prop] = desc;
        },
        getOwnPropertyDescriptor = Obj.getOwnPropertyDescriptor || function(obj, prop) {
            return obj[prop];
        };
    _.mixin({
        /**
         * Получает размеры окна
         * @returns {Array} [ширина,высота]
         **/
        screenSize: function() {
            var d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0],
                w = window.innerWidth || e.clientWidth || g.clientWidth,
                h = window.innerHeight || e.clientHeight || g.clientHeight;
            return [w, h]
        },

        // немного исправленный метод _.extend для корректной работы с дескрипторами полей.
        extend: function(obj) {
            if(!_.isObject(obj)) return obj;
            var source, prop;

            for(var i = 1, length = arguments.length; i < length; i++) {
                source = arguments[i];
                for(prop in source) {
                    if(hasOwnProperty.call(source, prop)) {
                        defineProperty(obj, prop, getOwnPropertyDescriptor(source, prop));
                    }
                }

            }
            return obj;
        },

        /**
         * Создаёт getter'ы и setter'ы для указанных полей fields
         * @param {Object} obj
         * @param {...Array.<String>|String} fields
         * @returns {Object} obj
         */
        createAlias: function(obj, prop, options) {
            
            function generateSetter(options) {
                
                var triggerFnName = options.throttle ? 'throttleTrigger' : 'trigger';
                
                return function (v) {
                    // для увеличения производительности присваиваем напрямую
                    this.attributes[prop] = v;

                    this[triggerFnName]('change:' + prop, this, v);
                    
                    return this.attributes[prop];
                }
                
            }
            options = options || {};

            defineProperty(obj, prop, {

                get: function() {
                    return this.attributes[prop]
                },

                set: generateSetter(options),

                enumerable: true,
                configurable: true
            })

            return obj;
        },


    });

    return _;
});