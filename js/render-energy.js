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
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(obj.dataPath, function (error, data) {
        var values = [];

        // get data for year of interest
        data = data.filter(function(d) { return d.Year == _year ; })

        data.forEach(function (d) {
            d.Value = +d.Value;
            values.push(d.Value)
        });



        console.log("filtered data");
        console.log(data);

        // Set yScale domain
        yScale.domain([0, 130]);

        // Generate a Bates distribution of 10 random variables.
        //var values = d3.range(1000).map(d3.random.bates(10));

        console.log("my values");
        console.log(values);
        
        // Generate a histogram using twenty uniformly-spaced bins.
        var data = d3.layout.histogram()
            .bins(xScale.ticks(30))
            (values);

        console.log(data);

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
        svg.selectAll("line.horizontalGrid").data(yScale.ticks(obj.yTicks)).enter()
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


        // Render bars
        var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("g")
            //.filter(function(d) { return d.Year == _year; })
            .attr("class", "bar")
            .attr("transform", function(d) {
                return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
            });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", xScale(data[0].dx) - 1)
            .attr("height", function(d) { return height - yScale(d.y); });
    });
}