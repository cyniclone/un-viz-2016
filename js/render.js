function drawScatter (chartObj) {
    var n = (chartObj.n > 1) ? chartObj.n : "";    // Used to control classing of second chart
    /*
     * value accessor - returns the value to encode for a given data object.
     * scale          - maps value to a visual display encoding, such as a pixel position.
     * map function   - maps from data value to display value
     * axis           - sets up axis
     */

    // Assign chart dimensions from object
    var dim = chartObj.dimensions,
        margin = dim.margin,
        width = dim.width - dim.margin.left - dim.margin.right,
        height = dim.height - dim.margin.top - dim.margin.bottom;

    // setup x
    var xValue = function (d) { return d.Year; },                    // data  -> value
        xScale = d3.scale.linear().range([0, width]),                // value -> display
        xMap = function (d) { return xScale(xValue(d));},           // data  -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom")
            .tickFormat(d3.format("d"));    // Remove commas from axis

    // setup y
    var yValue = function (d) { return d.Value; },                   // data  -> value
        yScale = d3.scale.linear().range([height, 0]),               // value -> display
        yMap = function (d) { return yScale(yValue(d));},           // data  -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left")
            .tickFormat(function (d) { return d + "%"; });    // Percents on axes

    if (debug.debug) { debug.xs = xScale; debug.ys = yScale; }

    // Initialize d3 tip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<b>" + d.CountryName + " - " + d.Year + "</b><br>"
                + d3.round(d.Value, 1) + " %";
        });

    // Make chart SVG
    var svg = d3.select(chartObj.targetDiv).append("svg")
        .attr("class", "viz" + n)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.csv(chartObj.dataPath, function (error, data) {
        data = data.filter(function(d) {
            if(isNaN(d.Value)){
                return false;
            }
            //d.Value = parseInt(d.Value, 10);
            return true;
        });

        data.forEach(function (d) {
            d.Value = +d.Value; // Force numeric
        });

        // Set scale domains
        xScale.domain(d3.extent(data, function (d) {
            return d.Year;
        })).nice();
        yScale.domain(d3.extent(data, function (d) {
            return d.Value;
        })).nice();

        // Draw gridlines for x axis
        svg.selectAll("line.verticalGrid" + n).data(xScale.ticks(10)).enter()
            .append("line")
            .attr(
                {
                    "class": "verticalGrid" + n,
                    "x1": function (d) {
                        return xScale(d);
                    },
                    "x2": function (d) {
                        return xScale(d);
                    },
                    "y1": height,
                    "y2": 0,
                    "fill": "none",
                    "stroke": "#fff",
                    "stroke-width": "0.75px"
                });
        // Draw gridlines for y axis
        svg.selectAll("line.horizontalGrid" + n).data(yScale.ticks(10)).enter()
            .append("line")
            .attr(
                {
                    "class": "horizontalGrid" + n,
                    "x1": 0,
                    "x2": width,
                    "y1": function (d) {
                        return yScale(d);
                    },
                    "y2": function (d) {
                        return yScale(d);
                    },
                    "fill": "none",
                    "stroke": "#fff",
                    "stroke-width": "0.75px"
                }
            );

        // Render axes
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text");
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text");

        // Render dots
        svg.selectAll(".scatterdot" + n)
            .data(data)
            .enter().append("circle")
            .attr("class", function (d) {
                return "scatterdot" + n + " c" + d.hash;
            })
            .attr("r", chartObj.radius)
            .attr('cx', xMap)
            .attr('cy', yMap)
            //.style("fill", "none")
            .on('mouseover', function (d) {
                tip.show(d);
                activate(d3.selectAll(".c" + d.hash));
            })
            .on('mouseout', function (d) {
                tip.hide(d);
                deactivate(d3.selectAll(".c" + d.hash));
            });

        if (chartObj.hasTrend) {
            drawLine(chartObj);
        }
    });
}

function drawLine (chartObj) {
    // Takes a given trendline and draws it to the #chart div
    var lm = chartObj.lm;   // Get coordinates from linear model
    var n = (chartObj.n > 1) ? chartObj.n : "";


    d3.select(".viz" + n +" g")
        .append("svg:line")
        .attr({
            "x1" : lm._x1,
            "x2" : lm._x2,
            "y1" : lm._y1,
            "y2" : lm._y2,
            "stroke-width": "3px"
        })
        .attr("class", "trend")
        .style("stroke", "#222");

    d3.selectAll('.trend').moveToFront();
}

function drawBars (chartObj) {
    //var dim = chartObj.dimensions;
    //var margin = {top: dim.top, right: dim.right, bottom: dim.bottom, left: dim.left},
    //    width = dim.width - margin.left - margin.right,
    //    height = dim.height - margin.top - margin.bottom;
    //// setup x

    //// setup y
    //var yValue = function(d) { return d.; },                  // data  -> value
    //    yScale = d3.scale.linear().range([height, 0]),              // value -> display
    //    yMap   = function(d) { return yScale(yValue(d)) ; },        // data  -> display
    //    yAxis  = d3.svg.axis().scale(yScale).orient("left");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 800 - margin.left - margin.right,
        height = 1600 - margin.top - margin.bottom;

    var xValue = function(d) { return d.Value; },                  // data  -> value
        xScale = d3.scale.linear().range([0, width]),               // value -> display
        xMap   = function(d) { return xScale(xValue(d)) ; },        // data  -> display
        xAxis  = d3.svg.axis().scale(xScale).orient("top");

    var yValue = function(d) { return d.Country},
        yScale = d3.scale.ordinal().rangeRoundBands([0, width], .1),
        yMap   = function(d) { return yScale(yValue(d));},
        yAxis  = d3.svg.axis().scale(yScale).orient("left");

    // Make chart SVG
    var svg = d3.select(chartObj.targetDiv).append("svg")
        .attr("class", "viz" + n)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(chartObj.dataPath, function(error, data) {

        // Set Scale domains
        yScale.domain(data.map(function(d) { return d.Country; } ));
        xScale.domain([-4, 12]);

        // Render axes
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text");
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text");


    });

}