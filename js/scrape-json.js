function scrape(geodata) {

    /* Using this part to store CSV data for ISO alpha-3 values */
    var c = geodata.objects.countries.geometries;
    var cData = [];

    c.forEach(function(d) {
        var row = [d.properties.admin, d.properties.id];

        cData.push(row);
        //console.log(d.properties.admin + "," + d.properties.id + ",");
        //s+= d.properties.admin + "," + d.properties.id + ",";
    });

    var csvContent = "data:text/csv;charset=utf-8,";
    cData.forEach(function(infoArray, index){

        dataString = infoArray.join(",");
        csvContent += index < cData.length ? dataString+ "\n" : dataString;

    });

    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}
