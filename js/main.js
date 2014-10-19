/**
 * Created with ya3.
 * User: ZigGreen
 * Date: 2014-10-16
 * Time: 08:43 AM
 */
requirejs.config({
    baseUrl: 'js',
    paths: {
        d3: '/bower_components/d3/d3',
        underscore: '/bower_components/underscore/underscore',
        backbone: '/bower_components/backbone/backbone',
        jquery: '/bower_components/jquery/dist/jquery'
    }
});
define(['config', 'd3', 'utils', 'models/Circle', 'models/Colorize'],
    function(c, d3, _, Circle, Colorize) {
        var screenSize = _.screenSize(),
            color = d3.scale.category10(),
            // c.nodesCount+1 так как 1 фейковый, привязывается к курсору
            nodes = d3.range(c.nodesCount + 1)
                .map(function() {
                    return new Circle({
                        field: {
                            width: screenSize[0],
                            height: screenSize[1]
                        }
                    })
                });

        // Задаём layout, нужен чтоб точки убегали от курсора
        var force = window.force = d3.layout.force()
            .gravity(c.gravity)
            .charge(function(d, i) {
                // нулевой отпугивает остальных своим полем :)
                return i ? 0 : c.cursoreGravity;
            })
            .nodes(nodes)
            .size(screenSize);

        force.start();

        var svg = d3.select("#body")
            .append("svg:svg")
            .attr("width", screenSize[0])
            .attr("height", screenSize[1]);



        var root = nodes[0];
        root.set({
            // для заметности сделаем размером 10
            radius: c.pinNodeToCursor * 10,
            //чтоб не действовал layout
            fixed: true
        });

        //привязываем "отпугивалку" к курсору
        svg.on("mousemove", function() {
            var p1 = d3.mouse(this);
            root.px = p1[0];
            root.py = p1[1];

        });




        //Создаём svg представлениыя в виде кругов
        var circles = svg.selectAll("circle")
        //для всех кроме нулевого -
        //он будет привязан к курсору 
        //и будет отпугивать остальных
        .data(nodes)
            .enter()
            .append("svg:circle")
            .attr("r", function(circle) {
                return circle.radius;
            });

        var colorize = new Colorize({
            items: circles,
        });

        colorize.start();


        force.on("tick", function(e) {

            for(var i = 0; ++i < nodes.length;) {
                var node = nodes[i];
                node.doStep();
            }




            var q = d3.geom.quadtree(nodes),
                n = nodes.length;

            for(var i = 0; ++i < nodes.length;) {
                q.visit(nodes[i].collide());
            }
            
            for(var i = 0; ++i < nodes.length;) {
                var node = nodes[i];

                if(node.x < 0 && node.vx < 0) {
                    node.vx *= -1;
                } else if(node.x > node.get('field').width && node.vx > 0) {
                    node.vx *= -1;
                }


                if(node.y < 0 && node.vy < 0) {
                    node.vy *= -1;

                } else if(node.y > node.get('field').height && node.vy > 0) {
                    node.vy *= -1;
                }
            }


            svg.selectAll("circle").attr("cx", function(circle) {
                return circle.x;
            }).attr("cy", function(circle) {
                return circle.y;
            });

            force.resume();
        });
    });