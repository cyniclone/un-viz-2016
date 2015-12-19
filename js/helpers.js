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