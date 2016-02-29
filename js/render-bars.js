var debug = {};

function drawBars (obj) {

    // Assign chart dimensions from object
    var dim = obj.dimensions,
        margin = dim.margin,
        width = dim.width - dim.margin.left - dim.margin.right,
        height = dim.height - dim.margin.top - dim.margin.bottom;

    // setup x
    var xValue = function (d) { return d.Value; },                   // data  -> value
        xScale = d3.scale.linear().range([0, width]),                // value -> display
        xMap = function (d) { return xScale(xValue(d));},           // data  -> display
        xAxis = d3.svg.axis().scale(xScale).orient("top")
            .tickFormat(d3.format("d"));

    if (obj.xTicks != undefined) {
        xAxis.ticks(obj.xTicks);
    }

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
    var svg = d3.select(obj.targetDiv).append("svg")
        .attr("class", "bar-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(obj.dataPath, function (error, data) {
        data.forEach(function(d) {d.Value = +d.Value;}); // Force numeric

        // Sort data
        data.sort(function(a, b) { return d3.ascending(a.Value, b.Value); });

        console.log(data);

        // Set scale domains
        //xScale.domain(d3.extent(data, function(d) { return d.Value; })).nice();
        xScale.domain(obj.xDomain);
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
            .style("font-size", "11px")
            .text(function(d) {
                var s = d.Value;
                if (obj.hasSuffix) {
                    return s + obj.suffix ;
                } else { return s; }
            });


        // Draw OECD average
        if (obj.hasAverage) {
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
function drawIneqBars (obj) {
    // Global variables; used by all charts in this visualization
    var dim = obj.dimensions,  // Bring in chart dimensions
        margin = dim.margin,
        width = dim.width - dim.margin.left - dim.margin.right,
        heightPerTick = dim.heightPerTick;
    // Height will vary for each country, and will be set later.

    // Setup x
    var xScale = d3.scale.linear().range([0, width]).domain(obj.xDomain);
    var xAxis  = d3.svg.axis().scale(xScale).orient("top")
        .tickFormat(function (d) { return d + "%"; })
        .tickPadding(5)
        .tickSize(10)
        .tickValues(obj.xTickValues);

    // Render x axis
    d3.select("#inequality-axis")
        .append("svg")
        .style("width", width + margin.left + margin.right)
        .style("height", "30px")
        .append("g")
        .attr("class", "x axis")
        .attr("transform","translate(" + margin.left + ", 30)")
        .call(xAxis);

     //Setup color scale
    var colorScale = d3.scale.ordinal().range(obj.colorScaleRange);


    d3.csv(obj.dataPath, function(error, _data) {
        if (error) throw error;

        data = _data;
        data.forEach(function (d) {
            d.ValueG = +d.ValueG; // Force numeric; value of general population
            d.ValueB = +d.ValueB; // Force numeric; value of bottom 40%
        });

        // Nest objects by country name so we can iterate through them
        data = d3.nest()
            .key(function (d) { return d.CountryName; })
            .map(data);

        debug.data = data;

        // MAIN LOOP here. For each country in the object...
        for(var i = 0; i < _.size(data); i++) {
            var countryName = _.keys(data)[i];
            var subObj = data[countryName];     // Sub-object for each loop iteration

            // Set height of chart based on number of periods
            var height = _.pluck(subObj, "Period").length * heightPerTick;

            // Make a div with id "#chart-" + countryName;
            var css_id = "chart-" + subObj[0].DivName;
            $("#charts").append("<div id='" + css_id + "' class='height-" + height + "'></div>"); // initializes empty

            // Setup y - each chart will have its own yScale and yAxis
            var yScale = d3.scale.ordinal().rangeRoundBands([0, height], .2)
                //.domain(function(d) {return d.Period; } );
                .domain(_.pluck(subObj, "Period")); // Gets list of property values for period

            var yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);
            var countryLabel = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);

            // Variable for chart DOM element
            var svg = d3.select("#" + css_id).append("svg")
                .attr("class", "bar-chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            // Draw grid-lines for x axis
            svg.selectAll("line.verticalGrid").data(obj.xTickValues).enter()
                .append("line")
                .attr(
                    {
                        "class": "verticalGrid",
                        "x1": function (d) { return xScale(d); },
                        "x2": function (d) { return xScale(d); },
                        "y1": height,
                        "y2": 0,
                        "fill": "none",
                        "stroke": "#fff",
                        "stroke-width": "0.75px",
                        "stroke-dasharray" : "2,2"
                    });

            // Render top border
            svg.append("g")
                .attr("class", "axis")
                .append("line")
                .attr({ "x1": -margin.left,  "x2": width,  "y1": 0,  "y2": 0 });

            // Render the country name to the left
            svg.append("g")
                .attr("class", "y axis")
                .call(countryLabel)
                .append("text")
                .attr("transform","translate(-" + margin.left + ", 20)")
                .text(function () { return countryName; });

            // Render y axis (period)
            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform","translate(0, 0)");

            // Render zero-line
            svg.append("g")
                .attr("class", "zero-line")
                .append("line")
                .attr({
                    "x1": xScale(0),
                    "x2": xScale(0),
                    "y1": 0,
                    "y2": height
                });
        }
    });
}