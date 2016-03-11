function renderLine(obj) {
    // Get values & domain for both kilometers and miles
    var km = obj.kilometers;
    var mi = obj.miles;

    var dim = obj.dimensions,
        margin = dim.margin,
        width = dim.width - dim.margin.left - dim.margin.right,
        height = dim.height - dim.margin.top - dim.margin.bottom;

    var xScale = d3.scale.linear().range([0, width]);
    var yScaleKm = d3.scale.linear().range([height, 0]);
    var yScaleMi = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(xScale)
        .orient("bottom")
        .tickFormat(d3.format("d")).tickSize(0)
        .tickValues(obj.years);

    var format = d3.format(".3n");

    var yAxisLeft = d3.svg.axis().scale(yScaleKm)
        .orient("left")
        .tickFormat(format)
        .tickValues(km.values)
        .tickSize(20)
        .tickPadding(10)
        .outerTickSize(0); //remove end ticks

    var yAxisRight = d3.svg.axis().scale(yScaleMi)
        .orient("right")
        .tickFormat(format)
        .tickValues(mi.values)
        .tickSize(20)
        .tickPadding(10)
        .outerTickSize(0); //remove end ticks

    var valueKm = d3.svg.line()
        .x(function(d) { return xScale(d.Year); })
        .y(function(d) { return yScaleKm(d.km); });
    //var valueMi = d3.svg.line()
    //    .x(function(d) { return xScale(d.Year); })
    //    .y(function(d) { return yScaleMi(d.mi); });

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            var html = "";
            html += "<b><u>" + d.Year + "</u></b><br />";
            html += d.km + " km &sup2; (millions)<br />"
            html += d.mi + " miles &sup2; (millions)";
            return html
        });

    var svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.csv(obj.path.csv, function(error, data) {
        data.forEach(function(d) {
            d.Year = +d.Year;
            d.mi = +d.mi;
            d.km = +d.km;
        });

        // Scale the range of the data
        xScale.domain(d3.extent(data, function(d) { return d.Year; }));
        yScaleKm.domain(km.domain);
        yScaleMi.domain(mi.domain);

        svg.append("path")        // Add the valueline path.
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", "1.5px")
            .attr("d", valueKm(data));

        // Render vertical lines
        svg.selectAll(".vertical-line")
            .data(data)
            .enter().append("line")
            .attr({
                "class": function (d) {
                    return "vertical-line " + d.Year;
                },
                "x1": function (d) { return xScale(d.Year); },
                "x2": function (d) { return xScale(d.Year); },
                "y1": function (d) { return yScaleKm(d.km)},
                "y2": height,
                "fill": "none",
                "stroke": "#fff",
                "stroke-width": "0.75px",
                "visibility" : "hidden"
            })

        // Render dots
        svg.selectAll(".circle")
            .data(data)
            .enter().append("circle")
            .attr("class", "circle")
            .attr("r", "6")
            .style({
                "fill" : "white",
                "stroke" : "#006A35",
                "stroke-width" : "1.5px"
            })
            .attr('cx', function(d) { return xScale(d.Year) })
            .attr('cy', function(d) { return yScaleKm(d.km) })
            .on('mouseover', function (d) {
                d3.select(this)
                    .attr("r", 8)
                    .style("fill", "#006A35")
                    .style("stroke", "white");

                // Show connecting vertical line when hovering over circle
                var sel = ".vertical-line." + d.Year;
                $(sel).css("visibility", "visible");
                tip.show(d);
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .attr("r", 6)
                    .style("fill", "white")
                    .style("stroke", "#006A35")

                var sel = ".vertical-line." + d.Year;
                $(".vertical-line").css("visibility", "hidden");
                tip.hide(d);
            });

        // Render x Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Render y Axis (left)
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxisLeft)
            .append("text")
            .style("text-anchor", "beginning")
            .attr("dy", yScaleKm(km.values[km.values.length-1]))
            .attr("dx", 10)
            .text("Square Kilometers")

        // Render y Axis (right)
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + " ,0)")
            .call(yAxisRight)
            .append("text")
            .style("text-anchor", "end")
            .attr("dy", yScaleMi(mi.values[mi.values.length-1]))
            .attr("dx", -10)
            .text("Square Miles");
    });
}