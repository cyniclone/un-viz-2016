

var margin = {top: 60, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();


//var color = d3.scale.linear()
//.domain([1,0,-1])
//.range(["#3182bd", "#d9d9d9", "#e6550d"]);

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
        return d.CountryName + "<br>" + d.Score;
    });


var svg = d3.select("#chart").append("svg")
    .attr("class", "viz")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);


d3.csv("data/2DataCHILDLongFormat.csv", function(error, data) {
    data.forEach(function(d) {
        d.Score = +d.Score;
    });

    x.domain(d3.extent(data, function(d) { return d.Year; })).nice();
    y.domain(d3.extent(data, function(d) { return d.Score; })).nice();

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



    /*
     .attr("class", "label")
     .attr("x", width/2)
     .attr("y", 30)
     .style("text-anchor", "end")
     .style('fill', 'white')
     .text("Year");*/

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text");

    /*
     .attr("class", "label")
     .attr("transform", "rotate(-90)")
     .attr("y", -30)
     .attr("dy", ".71em")
     .style("text-anchor", "end")
     .style('fill', 'white')
     .text("Score")
     */
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) {
            if (isNaN(d.Score)) {
                return x(-1000);
            }
            return x(d.Year);
        })
        .attr("cy", function(d) {
            if (isNaN(d.Score)) {
                return y(-1000);
            }
            return y(d.Score);
        })
        //.style("fill", function(d) { return color(d.Score); })
        .style("fill", "none")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
    ;

    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

});


/*
var margin = {top: 60, right: 20, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

// need to add d3 tip

var svg = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.csv('data/child-mortality-long.csv', function(error, data) {

    // Coerce values to numeric
    data.forEach(function(d) {
        console.log(d);
        d.Country   = +d.Country;
        d.Value     = +d.Value;
        d.Year      = +d.Year;
    })
}); */