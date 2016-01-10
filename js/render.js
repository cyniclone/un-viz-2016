function drawScatter (chartObj) {
    var n = (chartObj.n > 1) ? chartObj.n : "";    // Used to control classing of second chart

    var xTicks = !(chartObj.xTicks >= 0) ? 10 : chartObj.xTicks;
    var yTicks = !(chartObj.yTicks >= 0) ? 10 : chartObj.yTicks;

    var yMin = isNaN(chartObj.yMin) ? 0 : chartObj.yMin;
    var yMax = isNaN(chartObj.yMax) ? 100 : chartObj.yMax;

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
            .tickFormat(function (d) {
                if (chartObj.notPercent == undefined)
                    return d + "%";   // Percents on axes
                else {
                    var format = d3.format("0,000");
                    return format(d)
                }
            })
            .ticks(yTicks)
            .tickPadding(5);

    if (debug.debug) { debug.xs = xScale; debug.ys = yScale; }

    // Initialize d3 tip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            var s = "<b>" + d.CountryName + " - " + d.Year + "</b><br>";
            if (chartObj.notPercent == undefined) {
                s += d3.round(d.Value, 1) + " %";
                return s;
            }
            var format = d3.format("0,000");
            s += format(d.Value);
            return s;

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
        console.log(data);
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
        //yScale.domain(d3.extent(data, function (d) { return d.Value; })).nice();
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
        .style("stroke", chartObj.trendStroke);

    d3.selectAll('.trend').moveToFront();
}

function drawBars (chartObj) {

    var dim = chartObj.dimensions,
        margin = dim.margin,
        width = dim.width - dim.margin.left - dim.margin.right,
        height = dim.height - dim.margin.top - dim.margin.bottom;

    var xScale = d3.scale.linear().range([0, width]),               // value -> display
        xAxis  = d3.svg.axis().scale(xScale).orient("top");

    var yScale = d3.scale.ordinal().rangeRoundBands([0, height], .2),
        yAxis  = d3.svg.axis().scale(yScale).orient("left").ticks(8, "%");

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
            //d.ValueG = +d.ValueG; // Force numeric
            //d.ValueB = +d.ValueB; // Force numeric
        });

        // Set Scale domains
        //yScale.domain(data.map(function(d) { return d.Label; } ));
        yScale.domain(data.map(function(d) { return d.Label; } ));
        xScale.domain([-5, 12]);

        // Render axes
        svg.append("g")
            .attr("class", "x axis")
            //.attr("transform", "translate(0," + 0 + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.selectAll(".bottom.bar") // Draw bars for bottom 40
            .data(data)
            .enter().append("rect")
            .attr("y", function(d) { return yScale(d.Label) })
            .attr("height", yScale.rangeBand()/2)
            .attr("x", function(d) { return xScale(Math.min(0, d.ValueB)) })
            //.attr("width", function(d) { return xScale(d.ValueB); })
            .attr("width", function(d) { return Math.abs(xScale(d.ValueB) - xScale(0)); })
            .attr("fill", "white");

        svg.selectAll(".general.bar") // Draw bars for general population
            .data(data)
            .enter().append("rect")
            .attr("y", function(d) { return yScale(d.Label) + yScale.rangeBand()/2 + 1 })
            .attr("height", yScale.rangeBand()/2)
            .attr("x", function(d) { return xScale(Math.min(0, d.ValueG)) })
            //.attr("width", function(d) { return xScale(d.ValueG); })
            .attr("width", function(d) { return Math.abs(xScale(d.ValueG) - xScale(0)); })
            .attr("fill", "#8b1c34");
    });
}

function drawBars2 () {
    var outerWidth = 1000;
    var outerHeight = 800;
    var margin = { left: 200, top: 0, right: 100, bottom: 90 };
    var barPadding = 0.6
    var barPaddingOuter = 0.3;
    var innerWidth = outerWidth - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top - margin.bottom;

    // Create SVG
    var svg = d3.select("#chart").append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight);
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + 30 + ")");

    // The axis is on the right
    var xAxisG = g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + 10 + ")");

    // Common y axis for all
    var yAxisG = g.append("g")
        .attr("class", "y axis");

    var xScale = d3.scale.linear().range([0, innerWidth]);
    var yScale = d3.scale.ordinal()
        .rangeRoundBands([0, innerHeight], barPadding, barPaddingOuter);

    var yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);

    function render(data) {
        var xAxis = d3.svg.axis().scale(xScale).orient("top")
            .tickValues([-4, -2, 0, 2, 4, 6, 8, 10, 12])
            .outerTickSize(0)
            .innerTickSize(-1 * outerHeight);

        xScale.domain([-5, 15]);

        // Make y Axis labels
        var country = "";
        data.forEach(function(d) {
            if (d.CountryName == country) {
                d.label = d.Period;
            } else {
                d.label = d.Period;
                d.heading = d.CountryName;
            }
            country = d.CountryName;
        });

        var labels = data.map(function(d) {
            return d.label;
        });

        // Set domain for all Y labels
        yScale.domain(labels);
        xAxisG.call(xAxis);
        yAxisG.call(yAxis);

        // Make bar chart for general population
        var bars = g.selectAll(".ValueG").data(data);
        bars.enter().append("rect")
            .attr("height", yScale.rangeBand() / 2);
        bars.attr("x", function(d) { return xScale(0); })
            .attr("y", function(d) { return yScale(d.label); })
            .attr("width", function(d) { return xScale(d.ValueG) - xScale(0); })
            .style("fill", "#8b1c34")
            .attr("class", "ValueG");

        // Make bars for bottom 40% population
        var bars = g.selectAll(".ValueB").data(data);
        bars.enter().append("rect")
            .attr("height", yScale.rangeBand() / 2)
            .attr("x", function(d) { return xScale(0); })
            .attr("y", function(d) { return yScale.rangeBand() / 2 + yScale(d.label); })
            .attr("width", function(d) { return xScale(d.ValueB) - xScale(0); })
            .style("fill", "white")
            .attr("class", "ValueB")

        // Make grid lines for those data that have headings
        var lines = g.selectAll(".xLine").data(filter(function(d) { return !(d.heading == undefined) }));
        lines.enter().append("line")
        lines
            .attr("x1", 0)
            .attr("y1", function(d) { return (yScale(d.label) - yScale.rangeBand()) })
            .attr("x2", outerWidth)
            .attr("y2", function(d) { return (yScale(d.label) - yScale.rangeBand()) })
            .style("stroke", "blue")
            .attr("class", "xLine")
            .style("display", function(s) {
                if ((yScale(s.label) - yScale.rangeBand()) < 0) {
                    return "none"; // Don't show grids when y is negative
                }
            });

        // Make heading filtering data only for those which have headings
        var headings = g.selectAll(".heading").data(data.filter(function(d) { return !(d.heading == undefined )}));
        headings.enter().append("text")
            .text(function(d) { return d.heading })
            .attr("x", 0)
            .attr("y", function(d) {
                return (yScale(d.label) - yScale.rangeBand() + 30 )
            });
    }

    function type(d) {
        d.ValueA = +d.ValueA;
        d.ValueB = +d.ValueB;
        console.log(d);
        return d;
    }
    d3.csv("data/inequality.csv", type, render);
}