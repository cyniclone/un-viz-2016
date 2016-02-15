function renderMap (obj) {
    //var topojsonPath = "data/json/world-topo.topojson";
    //var csvPath = "data/sustainable.csv";

    //Map dimensions (in pixels)
    var width = obj.dimensions.width,
        height = obj.dimensions.height;

//Map projection
    var projection = d3.geo.equirectangular()
        .scale(175)
        .center([0,0]) //projection center
        .translate([width / 2, height / 2]) //translate to center the map in view

//Generate paths based on projection
    var path = d3.geo.path().projection(projection);

//Create an SVG
    var svg = d3.select("#map").append("svg").attr("width", width).attr("height", height);

//Group for the map features
    var features = svg.append("g").attr("class", "features");

//Create a tooltip, hidden at the start
    var tooltip = d3.select("body").append("div").attr("class", "world-tooltip");

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, Infinity])
        .on("zoom", zoomed);

    svg.call(zoom);

// Color scale
    // TODO: Value higher than 75 causes 'undefined' for threshold
    var threshold = d3.scale.threshold()
        //.domain([3, 6, 12, 24, 36, 60, 75, 110])
        .domain([6, 12, 24, 36, 60, 75])
        .range(d3.range(7).map(function (i) { return "q" + i + "-7"; }));

    var valueByCountryCode = d3.map();

    var q = d3_queue.queue();
    q
        .defer(d3.json, obj.path.topojson)
        .defer(d3.csv, obj.path.csv, function (d) {
            //console.log(d.CountryCode + " - " + threshold(val));

            valueByCountryCode.set(d.CountryCode, +d.PM2p5)
        })
        .await(ready);

    // The two defer calls will not be executed until ready() is
    function ready(error, geodata) {
        if (error) throw error;
        
        //Create a path for each map feature in the data
        features.selectAll("path")
            .data(topojson.feature(geodata,geodata.objects.countries).features) //generate features from TopoJSON
            .enter()
            .append("path")
            .attr("class", function(d) {

                var value = threshold(valueByCountryCode.get(d.properties.id));
                
                // check if value is defined
                if (value) { return value; } else { return "no-data"; }
            })
            .attr("d",path)
            .on("mouseover",showTooltip)
            .on("mousemove",moveTooltip)
            .on("mouseout",hideTooltip)
            .on("click",clicked);
    }

    /***** MAP CONTROLS GO HERE ************/

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
    function clicked(d,i) { }


//Update map on zoom/pan
    function zoomed() {
        features.attr("transform", "translate(" + zoom.translate() + ")scale(" + zoom.scale() + ")")
            .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
    }


//Position of the tooltip relative to the cursor
    var tooltipOffset = {x: 5, y: -25};

//Create a tooltip, hidden at the start
    function showTooltip(d) {
        moveTooltip();

        // TODO: add value to tooltip
        tooltip.style("display","block")
            .text(function () {
                var tooltipValue = valueByCountryCode.get(d.properties.id)

                var s = "";
                s += d.properties.admin + " - ";
                s += (tooltipValue) ? (tooltipValue + obj.tooltipText) : "no data";

                return s;
            });
    }

//Move the tooltip to track the mouse
    function moveTooltip() {
        tooltip.style("top",(d3.event.pageY + tooltipOffset.y) + "px")
            .style("left",(d3.event.pageX + tooltipOffset.x) + "px");

    }

//Create a tooltip, hidden at the start
    function hideTooltip() {
        tooltip.style("display","none");
    }

}