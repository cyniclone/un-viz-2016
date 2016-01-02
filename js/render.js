function drawScatter (chartObj) {
    var n = (chartObj.n > 1) ? chartObj.n : "";    // Used to control classing of second chart

    var xTicks = !(chartObj.xTicks >= 0) ? 10 : chartObj.xTicks;
    var yTicks = !(chartObj.yTicks >= 0) ? 10 : chartObj.yTicks;
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
        xMap = function (d) { return xScale(xValue(d)); },           // data  -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom")
            .tickFormat(d3.format("d"))  // Remove commas from axis
            .ticks(xTicks)
            .tickSize(10)
            .outerTickSize(0)
            .tickPadding(5);

    // setup y
    var yValue = function (d) { return d.Value; },                   // data  -> value
        yScale = d3.scale.linear().range([height, 0]),               // value -> display
        yMap = function (d) { return yScale(yValue(d)); },           // data  -> display
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
        svg.selectAll("line.verticalGrid" + n).data(xScale.ticks(xTicks)).enter()
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
        svg.selectAll("line.horizontalGrid" + n).data(yScale.ticks(yTicks)).enter()
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
            drawLine(chartObj, yScale);
        }
    });
}

function drawLine (chartObj, _yScale) {
    // Takes a given trendline and draws it to the #chart div
    var lm = chartObj.lm;   // Get coordinates from linear model
    var dim = chartObj.dimensions;
    var year = chartObj.year;
    var n = (chartObj.n > 1) ? chartObj.n : "";


    d3.select(".viz" + n +" g")
        .append("svg:line")
        .attr({
            "x1" : 0,
            "x2" : dim.width - dim.margin.left - dim.margin.right,
            "y1" : _yScale(lm.slope * year.begin + lm.intercept),
            "y2" : _yScale(lm.slope * year.end + lm.intercept),
            "stroke-width": "3px"
        })
        .attr("class", "trend")
        //.style("stroke", "#222");
        .style("stroke", chartObj.trendStroke);

    d3.selectAll('.trend').moveToFront();
}

function drawBars (chartObj) {

    var dim = chartObj.dimensions,
        margin = dim.margin,
        width = dim.width - dim.margin.left - dim.margin.right,
        height = dim.height - dim.margin.top - dim.margin.bottom;

    var xValue = function(d) { return d.Value },                    // data  -> value
        xScale = d3.scale.linear().range([0, width]),               // value -> display
        xMap   = function(d) { return xScale(xValue(d)) },          // data  -> display
        xAxis  = d3.svg.axis().scale(xScale).orient("top");

    var yValue = function(d) { return d.Index },
        yScale = d3.scale.ordinal().rangeRoundBands([0, height], .1),
        yMap   = function(d) { return yScale(yValue(d)) },
        yAxis  = d3.svg.axis().scale(yScale).orient("left").ticks(8, "%");

    var populationScale = d3.scale.ordinal();
    var color = d3.scale.ordinal().range(["#98abc5", "#7b6888"]);

    // Make chart SVG
    var svg = d3.select(chartObj.targetDiv).append("svg")
        .attr("class", "viz")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(chartObj.dataPath, function(error, data) {
        if (error) throw error;

        data.forEach(function (d) {
            d.Value = +d.Value; // Force numeric
        });

        // Set Scale domains
        yScale.domain(data.map(function(d) { return d.Index; } ));
        xScale.domain([-4, 12]);

        // Render axes
        svg.append("g")
            .attr("class", "x axis")
            //.attr("transform", "translate(0," + 0 + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("y", function(d) { return yScale(d.Index) })
            .attr("height", yScale.rangeBand())
            .attr("x", function(d) { return xScale(0) })
            .attr("width", function(d) { return width - xScale(d.Value); });
    });
}