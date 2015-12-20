/***** Static Content ************/

var charts = {}; // Object to hold all chart objects

// 1.) ZERO HUNGER
charts["hunger"] = {
    "value" : "hunger",
    "navText" : "Zero Hunger",
    "color" : "#DDA63B",
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
    "countryNamesPath" : "data/countrylist/list-hunger.csv",
    "data" : "data/hunger.csv",
    "howToRead" : {},
    "info" : ""
};
/**********************************/