function drawEnergy (chartObj, _year) {
    // Assign chart dimensions from object
    var dim = chartObj.dimensions;
    var margin = dim.margin;
    var width = dim.width - dim.margin.left - dim.margin.right;
    var height = dim.height - dim.margin.top - dim.margin.bottom;

    var xScale = d3.scale.linear().domain([0, 100]).range([0, width]);

    var yScale = d3.scale.linear()
        .range([height, 0]);

    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var svg = d3.select("#chart-" + _year).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(chartObj.dataPath, function (error, data) {
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
        yScale.domain([0, 100]);

        // Generate a Bates distribution of 10 random variables.
        //var values = d3.range(1000).map(d3.random.bates(10));

        console.log("my values");
        console.log(values);
        
        // Generate a histogram using twenty uniformly-spaced bins.
        var data = d3.layout.histogram()
            .bins(xScale.ticks(20))
            (values);

        console.log(data);

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

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", xScale(data[0].dx) / 2)
            .attr("text-anchor", "middle")
            .attr("fill", "steelblue")
            .text(function(d) { return formatCount(d.y); });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

    });
}