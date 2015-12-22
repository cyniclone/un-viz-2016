// Populate nav
function populateSelect(path) {
    console.log("populateSelect called");

    d3.csv(path, function(error, data) {
        var select = d3.select("#select-country").append("select");

        select.on("change", function() {
            deactivate(d3.selectAll(".dot"));

            var s = ".dot-" + d3.select(this).property("value");
            activate(d3.selectAll(s));
        });


        // Add a select option for each country
        select.selectAll("option")
            .data(data)
            .enter()
            .append("option")
            .attr("value", function (d) { return d.CountryName; })
            .text(function (d) { return d.CountryName; });
    });
};