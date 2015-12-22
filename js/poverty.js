initPov();

function initPov() {
    // Define scales
    var x = d3.scale.linear()
        .range([0, width]);
    var y = d3.scale.linear()
        .range([height, 0]);

// Define value maps
    var xMap = function(d) {
        if (isNaN(d.Year)) return x(-100); // Filter out NaNs

        return x(d.Year);
    };
    var yMap = function(d) {
        if (isNaN(d.Value)) return y(-100);

        return y(d.Value);
    };

// Define axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.format("d"));
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(function(d) { return d + "%"; });

// Initialize d3 tip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<b>" + d.CountryName + " - " + d.Year + "</b><br>" + d.Value + " %";
        });

    var svg = d3.select("#chart").append("svg")
        .attr("class", "viz")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.csv("data/povertylong.csv", function(error, data) {
        //data = data.filter(function(d){
        //    if(isNaN(d.Value)){
        //        return false;
        //    }
        //    d.Value = parseInt(d.Value, 10);
        //    return true;
        //});

        data.forEach(function(d) {
            d.Value = +d.Value;
        });

        // Set scale domains
        x.domain(d3.extent(data, function(d) { return d.Year; })).nice();
        y.domain(d3.extent(data, function(d) { return d.Value; })).nice();

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
                "y1" : function(d) {
                    // Don't render line if it's at 0%
                    if (y(d) == 650) return -100;
                    return y(d);
                },
                "y2" : function(d) {
                    if (y(d) == 650) return -100;
                    return y(d);
                },
                "fill" : "none",
                "stroke" : "#ccc",
                "stroke-width" : "0.75px"
            }
        );

        svg.append("g")
            .attr("class", "x axis pov")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis pov")
            .call(yAxis);

        // Render circles
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", function(d) {
                return "dot pov " + "dot-" + d.CountryCode;
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

        // Render the fitted line
        svg
            .append("line")
            .attr("class", "trendline")
            .attr("x1", function(d) { return x(1981); })
            .attr("y1", function(d) { return y(33.67); })
            .attr("x2", function(d) { return x(2012); })
            .attr("y2", function(d) { return y(10); })
            .attr("stroke", "#222")
            .attr("stroke-width", 2);

    });
}
