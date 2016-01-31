function drawEnergy (obj, _year) {
    // Assign chart dimensions from object
    var dim = obj.dimensions;
    var margin = dim.margin;
    var width = dim.width - dim.margin.left - dim.margin.right;
    var height = dim.height - dim.margin.top - dim.margin.bottom;

    var xScale = d3.scale.linear().domain([0, 100]).range([0, width]);

    var yScale = d3.scale.linear().range([height, 0]);

    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(obj.xTicks)
        .tickFormat(function(d) { return d + "%"; }).tickPadding(5)
        .orient("bottom");

    // setup y
    var yAxis = d3.svg.axis().scale(yScale).orient("left")
        .tickFormat(d3.format("0f"))
        .tickValues([ 20, 40, 60, 80, 100, 120, 130])
        .tickPadding(5)
        .outerTickSize(0);

    obj.yTicks = yAxis.ticks(); console.log(yAxis.ticks());

    var svg = d3.select("#chart-" + _year).append("svg")
        .attr("class", "viz")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(obj.dataPath, function (error, data) {
        if (error) throw error;
        var values = [];

        // get data for year of interest
        data = data.filter(function(d) { return d.Year == _year ; })

        data.forEach(function (d) {
            d.Value = +d.Value;
            values.push(d.Value)
        });

        // Set yScale domain
        yScale.domain([0, 130]);

        // Generate a histogram using twenty uniformly-spaced bins.
        var data = d3.layout.histogram()
            .bins(xScale.ticks(30))
            (values);

        //bar.append("text")
        //    .attr("dy", "-.75em")
        //    .attr("y", 6)
        //    .attr("x", xScale(data[0].dx) / 2)
        //    .attr("text-anchor", "middle")
        //    .attr("fill", "white")
        //    .text(function(d) { return formatCount(d.y); });

        // Render gridlines for x axis
        svg.selectAll("line.verticalGrid").data(xScale.ticks(obj.xTicks)).enter()
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
        // Render gridlines for y axis
        svg.selectAll("line.horizontalGrid").data(yScale.ticks(obj.yTicks/2)).enter()
            .append("line")
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
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            //.attr("transform", "translate(0, 0)")
            .call(yAxis);


        // Make info text box
        var text = "";
        var infoRect = d3.select("#chart-" + _year + " g")
            .append('g')
            .attr('id', 'info-text-' + _year);

        infoRect.attr({
                "transform" : "translate(5, 5)"
            })
            .append("text")
            .text(text)

        // Render bars
        var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("g")
            //.filter(function(d) { return d.Year == _year; })
            .attr("class", "bar")
            .attr("fill", "#F28F00")
            .attr("transform", function(d) {
                return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
            });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", xScale(data[0].dx) - 1)
            .attr("height", function(d) { return height - yScale(d.y); });

        bar.on('mouseover',function(d) {
                // Outline rect with stroke
                d3.select(this)
                    .style('stroke','black')
                    .style('stroke-weight', '1px')
                    .style('stroke-opacity', '1');

                d3.select("#info-text-" + _year + " text")
                    .text("In " + _year);

            })
            .on('mouseout',function(d) {
                // Make stroke invisible
                d3.select(this).style('stroke-opacity', '0')
            })

        //var infoText = d3.select("#chart-" + _year + " g")
        //    .append("text")
        //    .attr("id", "info-text-" + _year)
        //    .attr("transform", "translate(5, 5)")
        //    .text("a");

        //$("#info-text" + _year).html("<h3>hi</h3>");

    });
}