function drawScatter (obj) {
    // obj is our chart object - contains all information about how to
    //    organize data and render chart

    /***** Import rules from globals.js ************/

    var n = (obj.n > 1) ? obj.n : "";    // Used to control classing for dual charts

    var xTicks = !(obj.xTicks >= 0) ? 10 : obj.xTicks;
    var yTicks = !(obj.yTicks >= 0) ? 10 : obj.yTicks;

    var xMin = isNaN(obj.xMin) ? 0 : obj.xMin;
    var xMax = isNaN(obj.xMax) ? 100 : obj.xMax;

    var yMin = isNaN(obj.yMin) ? 0 : obj.yMin;
    var yMax = isNaN(obj.yMax) ? 100 : obj.yMax;

    var xParam = (obj.xParam == undefined) ? "Year" : obj.xParam;
    var yParam = (obj.yParam == undefined) ? "Value" : obj.yParam;
    if (obj.useCustomR) { var rParam = obj.rParam; }

    /*
     * value accessor - returns the value to encode for a given data object.
     * scale          - maps value to a visual display encoding, such as a pixel position.
     * map function   - maps from data value to display value
     * axis           - sets up axis
     */

    // Assign chart dimensions from object
    var dim = obj.dimensions,
        margin = dim.margin,
        width = dim.width - dim.margin.left - dim.margin.right,
        height = dim.height - dim.margin.top - dim.margin.bottom;

    // setup x
    var xValue = function (d) { return d[xParam]; },                    // data  -> value
        xScale = d3.scale.linear().range([0, width]),                // value -> display
        xMap = function (d) { return xScale(xValue(d)); },           // data  -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom")
            .tickFormat(d3.format("d"))  // Remove commas from axis
            .ticks(xTicks)
            .tickSize(10)
            .outerTickSize(0)
            //.tickPadding(5);

    // setup y
    var yValue = function (d) { return d[yParam]; },                   // data  -> value
        yScale = d3.scale.linear().range([height, 0]),               // value -> display
        yMap = function (d) { return yScale(yValue(d)); },           // data  -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left")
            .tickFormat(function (d) {
                if (obj.customFormat == undefined)
                    return d + "%";   // Percents on axes
                else {
                    return obj.customFormat(d);
                }
            })
            .ticks(yTicks)
            .tickPadding(5);

    // If we use variable radius, set up accessors
    if (obj.useCustomR) {
        var rValue = function (d) { return d[rParam]; },
            rScale = d3.scale.linear().range(obj.rRange);
    }

    if (debug.debug) { debug.xs = xScale; debug.ys = yScale; debug.rs = rScale;}

    // Initialize d3 tip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .style("width", function () {
            if (obj.value == "consumption") { return "300px"; } else { return "150px"; }
        })
        .offset([-10, 0])
        .html(function (d) {
            // Different tooltip for 'consumption' chart
            if (obj.value == "consumption") {
                var s = "<b><u>" + d.CountryName + "</u></b><br />";
                s += "<b>$" + d[xParam] + "</b> per person per year, energy subsidies<br/>";
                s += "<b>" + d[yParam] + "%</b> average subsidization rate<br />";
                s += "<b>" + d[rParam] + "%</b> of GDP";

                return s;
            }

            var s = "<b>" + d.CountryName + " - " + d[xParam] + "</b><br>";
            if (obj.customFormat != undefined) {
                s += obj.customFormat(d3.round(d[yParam], 1));
                return s;
            } else {
                s += d3.round(d[yParam], 1) + " %";
                return s;
            }

        });

    // Make chart SVG
    var svg = d3.select(obj.targetDiv).append("svg")
        .attr("class", "viz" + n)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.csv(obj.dataPath, function (error, data) {
        console.log(data);
        data = data.filter(function(d) {
            if(isNaN(d[yParam])){
                return false;
            }
            //d[yParam]e = parseInt(d[yParam], 10);
            return true;
        });

        data.forEach(function (d) {
            d[yParam] = +d[yParam]; // Force numeric
            if (obj.useCustomR) d[rParam] = +d[rParam];
        });

        // Set scale domains
        if (obj.useCustomX) {
            xScale.domain([xMin, xMax]);
        } else {
            xScale.domain(d3.extent(data, function (d) { return d[xParam]; })).nice();
        }

        if (obj.useCustomR) {
            rScale.domain(d3.extent(data, function (d) { return d[rParam]; })).nice();
        }
        yScale.domain([yMin, yMax]);

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
            .call(yAxis);

        // Render dots
        svg.selectAll(".scatterdot" + n)
            .data(data)
            .enter().append("circle")
            .attr("class", function (d) {
                return "scatterdot" + n + " c" + d.hash;
            })
            .attr("r", function(d) {
                if (obj.useCustomR) {
                    return rScale(rValue(d));
                } else {
                    return obj.radius;
                }
            })
            .attr('cx', xMap)
            .attr('cy', yMap)
            .on('mouseover', function (d) {
                deactivate(d3.selectAll(".active"));    // For IE11 compatibility
                $(".d3-tip").css("visibility", "visible"); // Also for IE
                tip.show(d);
                activate(d3.selectAll(".c" + d.hash));
            })
            .on('mouseout', function (d) {
                tip.hide(d);
                deactivate(d3.selectAll(".c" + d.hash));
            });


        if (obj.hasTrend) {
            obj.year = {};
            obj.year.begin = d3.min(data, function(d) { return d.Year; });
            obj.year.end = d3.max(data, function(d) { return d.Year; });

            drawLine(obj, yScale);
        }
        if (obj.hasLoess) {
            //drawLoess(data, obj, xMap, yMap);
        }
        
        // Special labeling for consumption viz
        if (obj.value == "consumption") {
            d3.select("g.y.axis").append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 8)
                .attr("x", "-8")
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Average Subsidization Rate (%)")

            d3.select("g.x.axis").append("text")
                .attr("x", width - 10)
                .attr("dy", "-.71em")
                .style("text-anchor", "end")
                .text("Energy subsidies per capita (US dollars per person a year)");
        }
    });
}

function drawLine (obj, _yScale) {
    // Takes a given trendline and draws it to the #chart div
    var lm = obj.lm;   // Get coordinates from linear model
    var dim = obj.dimensions;
    var year = obj.year;

    var n = (obj.n > 1) ? obj.n : "";


    d3.select(".viz" + n + " g")
        .append("svg:line")
        .attr({
            "x1" : 0,
            "x2" : dim.width - dim.margin.left - dim.margin.right,
            "y1" : _yScale(lm.slope * year.begin + lm.intercept),
            "y2" : _yScale(lm.slope * year.end + lm.intercept),
            "stroke-width": "3px"
        })
        .attr("class", "trend")
        .style("stroke", obj.trendStroke);

    d3.selectAll('.trend').moveToFront();
}

function drawLoess(_data, chartObj, _xMap, _yMap) {
    // Render the fitted line
    d3.select("#chart svg").append('path')
        .datum(function() {
            var loess = science.stats.loess();
            loess.bandwidth(0.25);

            var xValues = _data.map(_xMap);
            var yValues = _data.map(_yMap);

            var yValuesSmoothed = loess(xValues, yValues);

            return d3.zip(xValues, yValuesSmoothed);
        })
        .attr('id', 'trend')
        .attr('d', d3.svg.line()
            .interpolate('basis')
            .x(function(d) { return d[0]; })
            .y(function(d) { return d[1]; }))
}