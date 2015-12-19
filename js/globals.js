// Global variables

/***** Chart dimensions ************/
var margin = {top: 20, right: 40, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;
/**********************************/

/***** Static Content ************/
// ZERO HUNGER

var charts = {};

charts.hunger = {
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 40,
            bottom: 30,
            left: 50
        },
        "width" : 800,
        "height" : 700
    },
    "header" : "ZERO HUNGER",
    "countryNamesPath" : "data/countrylist-hunger.csv",
    "data" : "data/hunger.csv",
    "howToRead" : {},
    "info" : ""
};
/**********************************/
