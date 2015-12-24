/***** Static Content ************/

var charts = {}; // Object to hold all chart objects

// 1.) ZERO HUNGER
charts["hunger"] = {
    "value" : "hunger",
    "navText" : "Zero Hunger",
    "color" : "#DDA63B",
    "targetDiv" : "#chart",
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
    "radius" : 5,
    "header" : "ZERO HUNGER",
    "countryNamesPath" : "data/countrylist/list-zero-hunger.csv",
    "dataPath" : "data/zero-hunger.csv",
    "howToRead" : "",
    "info" : "",
    "hasTrend" : true,
    "lm" : {
        _x1 : 0,
        _x2 : 710,
        _y1 : 464.97,
        _y2 : 550.96
    }
};

// 2.) QUALITY EDUCATION
charts["educationf"] = {
    "value" : "educationf",
    "targetDiv" : "#chart",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 0,
            bottom: 30,
            left: 40
        },
        "width" : 500,
        "height" : 500
    },
    "radius" : 3,
    "header" : "QUALITY EDUCATION",
    "countryNamesPath" : "data/countrylist/list-education.csv",
    "dataPath" : "data/education-f.csv",
    "hasTrend" : false,
    "lm" : {
        _x1 : 0,
        _x2 : 710,
        _y1 : 464.97,
        _y2 : 550.96
    }
};
charts["educationm"] = {
    "value" : "educationm",
    "targetDiv" : "#chart2",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 0,
            bottom: 30,
            left: 40
        },
        "width" : 500,
        "height" : 500
    },
    "radius" : 3,
    "header" : "QUALITY EDUCATION",
    "countryNamesPath" : "data/countrylist/list-education.csv",
    "dataPath" : "data/education-m.csv",
    "hasTrend" : false,
    "lm" : {
        _x1 : 0,
        _x2 : 710,
        _y1 : 464.97,
        _y2 : 550.96
    }
};

/**********************************/