var margin = {top: 60, right: 20, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

// need to add d3 tip

var svg = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.csv('data/child-mortality-long.csv', function(error, data) {

    // Coerce values to numeric
    data.forEach(function(d) {
        console.log(d);
        d.Country   = +d.Country;
        d.Value     = +d.Value;
        d.Year      = +d.Year;
    })



});