function renderLine(obj) {
    var dim = obj.dimensions,
        margin = dim.margin,
        width = dim.width - dim.margin.left - dim.margin.right,
        height = dim.height - dim.margin.top - dim.margin.bottom;

    var xScale = d3.scale.linear().range([0, width]);
    var yScaleKm = d3.scale.linear().range([height, 0]);
    var yScaleMi = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(xScale)
        .orient("bottom")
        .tickFormat(d3.format("d"))
        .tickValues(obj.years);

    var format = d3.format(".3n");

    var yAxisLeft = d3.svg.axis().scale(yScaleKm)
        .orient("left")
        .tickFormat(format)
        .tickValues(obj.kilometers.values);

    var yAxisRight = d3.svg.axis().scale(yScaleMi)
        .orient("right")
        .tickFormat(format)
        .tickValues(obj.miles.values);

    var valueKm = d3.svg.line()
        .x(function(d) { return xScale(d.Year); })
        .y(function(d) { return yScaleKm(d.km); });
    var valueMi = d3.svg.line()
        .x(function(d) { return xScale(d.Year); })
        .y(function(d) { return yScaleMi(d.mi); });

    var svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(obj.path.csv, function(error, data) {
        data.forEach(function(d) {
            d.Year = +d.Year;
            d.mi = +d.mi;
            d.km = +d.km;
        });

        // Scale the range of the data
        xScale.domain(d3.extent(data, function(d) { return d.Year; }));
        yScaleKm.domain(obj.kilometers.domain);
        yScaleMi.domain(obj.miles.domain);

        svg.append("path")        // Add the valueline path.
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("d", valueKm(data));

        svg.append("path")        // Add the valueline2 path.
            .style("fill", "none")
            .style("stroke", "black")
            .attr("d", valueMi(data));

        svg.append("g")            // Add the X Axis
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .style("fill", "steelblue")
            .call(yAxisLeft);

        svg.append("g")
            .attr("class", "y axis")
            .style("fill", "red")
            .attr("transform", "translate(" + width + " ,0)")
            .call(yAxisRight);
    });

}