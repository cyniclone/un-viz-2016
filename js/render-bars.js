function drawIneqBars (chartObj) {

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

function drawBars (chartObj) {

    // Assign chart dimensions from object
    var dim = chartObj.dimensions,
        margin = dim.margin,
        width = dim.width - dim.margin.left - dim.margin.right,
        height = dim.height - dim.margin.top - dim.margin.bottom;

// setup x
    var xValue = function (d) { return d.Value; },                   // data  -> value
        xScale = d3.scale.linear().range([0, width]),                // value -> display
        xMap = function (d) { return xScale(xValue(d));},           // data  -> display
        xAxis = d3.svg.axis().scale(xScale).orient("top")
            .tickFormat(d3.format("d"));

    // setup y
    var yValue = function (d) { return d.CountryName; },              // data  -> value
        yScale = d3.scale.ordinal().rangeRoundBands([height, 0], .5), // value -> display
        yMap = function (d) { return yScale(yValue(d));},             // data  -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    // Initialize d3 tip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            var s = d.Value + "%<br>";
            return s;
        });

    // Make chart SVG
    var svg = d3.select(chartObj.targetDiv).append("svg")
        .attr("class", "bar-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(chartObj.dataPath, function (error, data) {
        data.forEach(function(d) {d.Value = +d.Value;}); // Force numeric

        // Sort data
        data.sort(function(a, b) { return d3.ascending(a.Value, b.Value); });

        console.log(data);

        // Set scale domains
        xScale.domain(d3.extent(data, function(d) { return d.Value; })).nice();
        yScale.domain(data.map(function(d) { return d.CountryName; }));

        // Render Axes
        svg.append("g")
            .attr("class", "x axis")
            //.attr("transform", "translate(0," + 0 + ")")
            .call(xAxis)
            .append("text");
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text");

        // Render bars
        svg.selectAll(".hBar")
            .data(data)
            .enter().append("rect")
            .attr({
                "class" : "hBar",
                "x" : 0 ,
                "width" : function(d) { return xScale(d.Value); },
                "y" : function(d) { return yScale(d.CountryName); },
                "height" : yScale.rangeBand(),
                "fill" : "white",
                "opacity" : 0.75
            });

        svg.selectAll(".hBarText")
            .data(data)
            .enter().append("text")
            .attr("class", "hBarText")
            .attr("x", function(d) { return xScale(d.Value) + 5; })
            .attr("y", function(d) { return yScale(d.CountryName) + yScale.rangeBand() / 2; })
            .attr("dy", ".35em")
            .attr("fill", "white")
            .text(function(d) {
                var s = d.Value;
                if (chartObj.percentSuffix != undefined) {
                    return s + "%" ;
                } else { return s; }
            });


        // Draw OECD average
        if (chartObj.hasAverage) {
            var averageLine = d3.select(".bar-chart g")
                .append("svg:line")
                .attr({
                    "class" : "line averageLine",
                    "x1": function() { return xScale(18); },
                    "x2": function() { return xScale(18); },
                    "y1": height,
                    "y2": 0,
                    "fill": "none",
                    "stroke": "#fff",
                    "stroke-width": "2px",
                    "stroke-opacity": 0.5,
                })
                .style("stroke-dasharray","2, 2");

            svg.append("text")
                .text("OECD Average: 18%")
                .attr({
                    "class" : "text-label",
                    //"x" : function() { return xScale(18) + 2; },
                    //"y" : 600,
                    "fill" : "white",
                    dy: "-0.35em",
                    "font-size" : "18px"
                })
                .attr("transform", function() {
                    var s = "translate(" + xScale(18) + ", 600)";
                    s += " rotate(90)"
                    return s;
                });
        }
    });

    svg.call(tip);
}