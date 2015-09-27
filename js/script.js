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
    data = data.filter(function(d){
        if(isNaN(d.Score)){
            return false;
        }
        d.Score = parseInt(d.Score, 10);
        return true;
    });

    data.forEach(function(d) {
        d.Score = +d.Score;
        if(isNaN(d.Score)) console.log("d.Score not a number");
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
        .attr("class", function(d) {
            return "dot " + "dot-" + d.CountryCode;
        })
        .attr("r", 3.5)
        .attr("cx", function(d) {
            if (isNaN(d.Score)) {
                return x(-100);
            }
            return x(d.Year);
        })
        .attr("cy", function(d) {
            if (isNaN(d.Score)) {
                return y(-100);
            }
            return y(d.Score);
        })
        //.style("fill", "none")
        .on('mouseover', function(d) {
            tip.show(d);
            activate(d3.selectAll('.dot-' + d.CountryCode));
        })
        .on('mouseout', function(d) {
            tip.hide(d);
            deactivate(d3.selectAll('.dot-' + d.CountryCode));
        })
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

    // Render the fitted line

    svg.append('path')
        .datum(function() {
            var loess = science.stats.loess();
            loess.bandwidth(0.25);

            var xValues = data.map(x);
            var xValues = Math.random()*50;
            var yValues = data.map(y);
            var yValues = Math.random()*50;

            var yValuesSmoothed = loess(xValues, yValues);

            return d3.zip(xValues, yValuesSmoothed);
        })
        .attr('class', 'line')
        .attr('d', d3.svg.line()
            .interpolate('basis')
            .x(function(d) { return d[0]; })
            .y(function(d) { return d[1]; }))

});


// Util functions
function activate(selector) {
    selector.classed("active", true);
    selector.moveToFront();
}

function deactivate(selector) {
    selector.classed("active", false);
}

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};