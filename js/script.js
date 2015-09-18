var margin = {top: 60, right: 20, bottom: 30, left: 40},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


var y = d3.scale.linear()
    .range([height, 0]);