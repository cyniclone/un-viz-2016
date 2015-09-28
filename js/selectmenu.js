// Read country names and populate select menu
d3.csv("data/countrynames.csv", function(error, data) {
    var select = d3.select("#select-country").append("select");

    select.on("change", function() {
        deactivate(d3.selectAll(".dot"));

        var s = ".dot-" + d3.select(this).property("value");
        activate(d3.selectAll(s));
    });

    select.selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", function (d) { return d.CountryCode; })
        .text(function (d) { return d.CountryName; });
});