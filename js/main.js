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
define(['config', 'd3', 'utils', 'models/Circle', 'models/Colorize'], function(c, d3, _, Circle, Colorize) {
    var screenSize = _.screenSize(),
        color = d3.scale.category10(),
        nodes = d3.range(c.nodesCount)
            .map(function() {
                return new Circle({
                    field: {
                        width: screenSize[0],
                        height: screenSize[1]
                    }
                })
            });

    // Задаём layout, нужен чтоб точки убегали от курсора
    var force = d3.layout.force()
        .gravity(c.gravity)
        .charge(function(d, i) {
            // нулевой отпугивает остальных своим полем :)
            return i ? 0 : c.cursoreGravity;
        })
        .nodes(nodes)
        .size(screenSize);
    force.start();



    var root = nodes[0];

    root.set({
        radius: 0,
        //чтоб не действовал layout
        fixed: true
    });


    var svg = d3.select("#body")
        .append("svg:svg")
        .attr("width", screenSize[0])
        .attr("height", screenSize[1]);


    var colorize = (new Colorize).start();

    //Создаём svg представлениыя в виде кругов
    var circles = svg.selectAll("circle")
    //для всех кроме нулевого -
    //он будет привязан к курсору 
    //и будет отпугивать остальных
    .data(nodes.slice(1))
        .enter()
        .append("svg:circle")
        .attr("r", function(circle) {
            return circle.radius;
        })
        .style("fill", c.colors[0])
        .each(colorize.transitionGenerator());



    //привязываем "отпугивалку" к курсору
    svg.on("mousemove", function() {
        var p1 = d3.mouse(this);
        root.px = p1[0];
        root.py = p1[1];
        force.resume();
    });

    force.on("tick", function(e) {

        for(var i = 0; ++i < nodes.length;) {
            nodes[i].run();
        }

        var q = d3.geom.quadtree(nodes),
            i = 0,
            n = nodes.length;

        while(++i < n) {
            q.visit(nodes[i].collide());
        }

        svg.selectAll("circle").attr("cx", function(circle) {
            return circle.x;
        }).attr("cy", function(circle) {
            return circle.y;
        });
    });
});