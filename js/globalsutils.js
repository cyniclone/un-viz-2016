// Global variables
var margin = {top: 20, right: 40, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// Util functions
function activate(selector) {
    selector.classed("active", true);
    selector.moveToFront();
}

function deactivate(selector) {
    selector.classed("active", false);
    d3.select('#goal').moveToFront();
    d3.select('#trend').moveToFront()
}

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};