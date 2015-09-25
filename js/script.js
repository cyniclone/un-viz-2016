
var margin = {top: 20, right: 40, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// Define scales
xScale = d3.time.scale().range([0, width]);
yScale = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format("d"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<b>" + d.CountryName + " - " + d.Year + "</b><br>" + d.Score;
    });


var svg = d3.select("#chart").append("svg")
    .attr("class", "viz")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("data/childmortalitylong.csv", function(error, data) {
    data.forEach(function(d) {
        d.Score = +d.Score;
    });

    x.domain(d3.extent(data, function(d) { return d.Year; })).nice();
    y.domain(d3.extent(data, function(d) { return d.Score; })).nice();

    // Set scale domains
    xScale.domain(d3.extent(data, x));
    yScale.domain([0, d3.max(data, y)]);

    // Draw gridlines for x axis
    svg.selectAll("line.verticalGrid").data(x.ticks(10)).enter()
        .append("line")
        .attr(
        {
            "class": "verticalGrid",
            "x1" : function(d) { return x(d); },
            "x2" : function(d) { return x(d); },
            "y1" : height,
            "y2" : 0,
            "fill" : "none",
            "stroke" : "#ccc",
            "stroke-width" : "0.75px"
        });

    // Draw gridlines for y axis
    svg.selectAll('line.horizontalGrid').data(y.ticks(10)).enter()
        .append('line')
        .attr(
        {
            "class": "horizontalGrid",
            "x1" : 0,
            "x2" : width,
            "y1" : function(d) { return y(d); },
            "y2" : function(d) { return y(d); },
            "fill" : "none",
            "stroke" : "#ccc",
            "stroke-width" : "0.75px"
        }
    );

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text");

    // Render circles
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) {
            if (isNaN(d.Score)) {
                return x(0);
            }
            return x(d.Year);
        })
        .attr("cy", function(d) {
            if (isNaN(d.Score)) {
                return y(0);
            }
            return y(d.Score);
        })
        .style("visibility", function(d) {
            if (isNaN(d.Score) || isNaN(d.Year)) {
                return "hidden";
            }
        })
        //.style("fill", "none")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
    ;

    // Render goal line
    svg.append("svg:line")
        .attr({
            "class" : "goal-line",
            "x1" : 0,
            "x2" : width + 5,
            "y1" : y(25),
            "y2" : y(25),
            "stroke-width" : "2px"
        })
        .style("stroke", "#222");

    // Goal Number
    svg.append("g")
        .attr("class", "goal-num")
        .append("text")
        .attr("y", y(25))
        //.attr("dy", "-0.71em")
        .attr("dx", width + 10)
        .style("text-align", "center")
        .text("25");

    svg.append("g") // Goal line description
        .attr("class", "goal-line-text")
        .append("text")
        .attr("transform", "rotate(90)")
        .attr("y", -height)
        .attr("dx", width - 70)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Goal for 2030");


    //svg.append("g")
    //    .attr("class", "y axis")
    //    .call(yAxis)
    //    .append("text")
    //    .attr("transform", "rotate(-90)")
    //    .attr("y", 6)
    //    .attr("dy", ".71em")
    //    .attr("dx", -250)
    //    .style("text-align", "end")
    //    .text("Population");



    // Render legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

});

