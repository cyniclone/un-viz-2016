
//Map dimensions (in pixels)
var width = 600,
    height = 309;

//Map projection
var projection = d3.geo.mercator()
    .scale(93.51993278144236)
    .center([3.304581611064289,-1.3409442035493517]) //projection center
    .translate([width/2,height/2]) //translate to center the map in view

//Generate paths based on projection
var path = d3.geo.path()
    .projection(projection);

//Create an SVG
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

//Group for the map features
var features = svg.append("g")
    .attr("class","features");

//Create zoom/pan listener
//Change [1,Infinity] to adjust the min/max zoom scale
var zoom = d3.behavior.zoom()
    .scaleExtent([1, Infinity])
    .on("zoom",zoomed);

svg.call(zoom);

//Create a tooltip, hidden at the start
var tooltip = d3.select("#map").append("div").attr("class","world-tooltip");

d3.json("data/json/world-topo.topojson",function(error,geodata) {
    if (error) return console.log(error); //unknown error, check the console

    //Create a path for each map feature in the data
    features.selectAll("path")
        .data(topojson.feature(geodata,geodata.objects.countries).features) //generate features from TopoJSON
        .enter()
        .append("path")
        .attr("d",path)
        .on("mouseover",showTooltip)
        .on("mousemove",moveTooltip)
        .on("mouseout",hideTooltip)
        .on("click",clicked);

});

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {

}


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

    tooltip.style("display","block")
        .text(d.properties.admin);
}

//Move the tooltip to track the mouse
function moveTooltip() {
    tooltip.style("top",(d3.event.pageY+tooltipOffset.y)+"px")
        .style("left",(d3.event.pageX+tooltipOffset.x)+"px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
    tooltip.style("display","none");
}