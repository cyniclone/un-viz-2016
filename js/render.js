function drawScatter (path) {
    /*
     * value accessor - returns the value to encode for a given data object.
     * scale          - maps value to a visual display encoding, such as a pixel position.
     * map function   - maps from data value to display value
     * axis           - sets up axis
     */

    // Chart dimensions
    var margin = {top: 20, right: 20, bottom: 20, left: 60},
        width = 800 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // setup x
    var xValue = function (d) { return d.Year; },                    // data  -> value
        xScale = d3.scale.linear().range([0, width]),                // value -> display
        xMap = function (d) { return xScale(xValue(d)); },           // data  -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.format("d"));    // Remove commas from axis

    // setup y
    var yValue = function (d) { return d.Value; },                   // data  -> value
        yScale = d3.scale.linear().range([height, 0]),               // value -> display
        yMap = function (d) { return yScale(yValue(d)); },           // data  -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(
            function (d) { return d + "%"; });    // Percents on axes

    // Initialize d3 tip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<b>" + d.CountryName + " - " + d.Year + "</b><br>" + d.Value + " %";
        });

    // Make chart SVG
    var svg = d3.select("#chart").append("svg")
        .attr("class", "viz")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.csv(path, function (error, data) {

        data = data.filter(function(d){
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
        svg.selectAll("line.verticalGrid").data(xScale.ticks(10)).enter()
            .append("line")
            .attr(
                {
                    "class": "verticalGrid",
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
        svg.selectAll('line.horizontalGrid').data(yScale.ticks(10)).enter()
            .append('line')
            .attr(
                {
                    "class": "horizontalGrid",
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
        svg.selectAll(".scatterdot")
            .data(data)
            .enter().append("circle")
            .attr("class", function (d) {
                return "scatterdot " + "scatterdot-" + d.CountryCode;
            })
            .attr("r", 5)
            .attr('cx', xMap)
            .attr('cy', yMap)
            //.style("fill", "none")
            .on('mouseover', function (d) {
                tip.show(d);
                activate(d3.selectAll('.scatterdot-' + d.CountryCode));
            })
            .on('mouseout', function (d) {
                tip.hide(d);
                deactivate(d3.selectAll('.scatterdot-' + d.CountryCode));

            });

        // Render trend line
        /*
        svg.append("g").attr("id", "goal")
            .append("svg:line")
            .attr({
                "x1": 0,
                "x2": width + 5,
                "y1": yScale(25),
                "y2": yScale(25),
                "stroke-width": "2px"
            })
            .style("stroke", "#222");
        */

    });
}