initChildMort();

function initChildMort() {
    // Define scales
    var x = d3.scale.linear()
        .range([0, width]);
    var y = d3.scale.linear()
        .range([height, 0]);

// Define value maps
    var xMap = function(d) { return x(d.Year) };
    var yMap = function(d) { return y(d.Score) };


// Define axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.format("d"));
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


// Initialize d3 tip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<b>" + d.CountryName + " - " + d.Year + "</b><br>" + d.Score;
        });

    var svg = d3.select("#chart").append("svg")
        .attr("class", "viz")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.csv("data/childmortalitylong.csv", function(error, data) {
        data = data.filter(function(d){
            if(isNaN(d.Score)){
                return false;
            }
            d.Score = parseInt(d.Score, 10);
            return true;
        });

        data.forEach(function(d) {
            d.Score = +d.Score;
        });

        // Set scale domains
        x.domain(d3.extent(data, function(d) { return d.Year; })).nice();
        y.domain(d3.extent(data, function(d) { return d.Score; })).nice();

        // Draw gridlines for x axis
        svg.selectAll("line.verticalGrid").data(x.ticks(10)).enter()
            .append("line")
            .attr(
            {
                "class": "verticalGrid",
                "x1" : function(d) { return x(d); },
                "x2" : function(d) { return x(d); },
                "y1" : height,
                "y2" : 0,
                "fill" : "none",
                "stroke" : "#ccc",
                "stroke-width" : "0.75px"
            });

        // Draw gridlines for y axis
        svg.selectAll('line.horizontalGrid').data(y.ticks(10)).enter()
            .append('line')
            .attr(
            {
                "class": "horizontalGrid",
                "x1" : 0,
                "x2" : width,
                "y1" : function(d) { return y(d); },
                "y2" : function(d) { return y(d); },
                "fill" : "none",
                "stroke" : "#ccc",
                "stroke-width" : "0.75px"
            }
        );

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text");

        // Render circles
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", function(d) {
                return "dot " + "dot-" + d.CountryCode;
            })
            .attr("r", 3.5)
            .attr('cx', xMap)
            .attr('cy', yMap)
            //.style("fill", "none")
            .on('mouseover', function(d) {
                tip.show(d);
                activate(d3.selectAll('.dot-' + d.CountryCode));
            })
            .on('mouseout', function(d) {
                tip.hide(d);
                deactivate(d3.selectAll('.dot-' + d.CountryCode));

            });

        // Render goal line
        svg.append("g").attr("id", "goal")
            .append("svg:line")
            .attr({
                "x1" : 0,
                "x2" : width + 5,
                "y1" : y(25),
                "y2" : y(25),
                "stroke-width" : "2px"
            })
            .style("stroke", "#222");

        // Goal Number
        svg.append("g")
            .attr("class", "goal-num")
            .append("text")
            .attr("y", y(10))
            .attr("dx", width + 10)
            .style("text-align", "center")
            //.text("25")
        ;

        svg.append("g") // Goal line description
            .attr("class", "goal-line-text")
            .append("text")
            .attr("transform", "rotate(90)")
            .attr("y", -height)
            .attr("dx", width - 70)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            //.text("")
        ;

        // Render the fitted line

        svg.append('path')
            .datum(function() {
                var loess = science.stats.loess();
                loess.bandwidth(0.25);

                var xValues = data.map(xMap);
                var yValues = data.map(yMap);

                var yValuesSmoothed = loess(xValues, yValues);

                return d3.zip(xValues, yValuesSmoothed);
            })
            .attr('id', 'trend')
            .attr('d', d3.svg.line()
                .interpolate('basis')
                .x(function(d) { return d[0]; })
                .y(function(d) { return d[1]; }))

    });
}

