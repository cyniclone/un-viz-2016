/***** Static Content ************/
var xs, ys, debug = { debug : true, xs : xs, ys : ys }; // Object for debugging and calculating trend lines

var charts = {}; // Object to hold all chart objects

// 1.) ZERO HUNGER
charts["hunger"] = {
    "n"     : 1,
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
    "hasTrend" : true,
    "trendStroke" : "#222",
    "lm" : {
        _x1 : 0,
        _x2 : 710,
        _y1 : 464.97,
        _y2 : 550.96
    }
};

// 2.) QUALITY EDUCATION

//Coefficients:
//(Intercept)        Value
//1983.3630       0.1534
charts["educationf"] = {
    "n"     : 1,
    //"secondary" : false,
    "value" : "educationf",
    "targetDiv" : "#chart",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        "width" : 500,
        "height" : 500
    },
    "radius" : 3,
    "header" : "QUALITY EDUCATION",
    "countryNamesPath" : "data/countrylist/list-education.csv",
    "dataPath" : "data/education-f.csv",
    "hasTrend" : true,
    "trendStroke" : "#222",
    "lm" : {
        _x1 : 0,
        _x2 : 430,
        _y1 : 376.75,
        _y2 : 241.75
    }
};

//Coefficients:
// (Intercept)        Value
// 1982.1074       0.1674
charts["educationm"] = {
    "n"     : 2,
    //"secondary" : true,
    "value" : "educationm",
    "targetDiv" : "#chart2",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        "width" : 500,
        "height" : 500
    },
    "radius" : 3,
    "header" : "QUALITY EDUCATION",
    "countryNamesPath" : "data/countrylist/list-education.csv",
    "dataPath" : "data/education-m.csv",
    "hasTrend" : true,
    "trendStroke" : "#222",
    "lm" : {
        _x1 : 0,
        _x2 : 430,
        _y1 : 346.65,
        _y2 : 229.76
    }
};

// WATER ACCESS
// (Intercept)         Year
// -719.5411747    0.4014397
charts["waterg"] = {
    "n"     : 1,
    "value" : "waterg",
    "targetDiv" : "#chart",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        "width" : 550,
        "height" : 650
    },
    "radius" : 3,
    "countryNamesPath" : "data/countrylist/list-water.csv",
    "dataPath" : "data/water-general.csv",
    "hasTrend" : true,
    "trendStroke" : "#e9432e",
    "lm" : {
        _x1 : 0,
        _x2 : 430,
        _y1 : 124.52,
        _y2 : 61.91
    }
};

// (Intercept)         Year
// -972.5403630    0.5245499
charts["waterr"] = {
    "n"     : 2,
    "value" : "waterr",
    "targetDiv" : "#chart2",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 20,
            bottom: 30,
            left: 40
        },
        "width" : 550,
        "height" : 650
    },
    "radius" : 3,
    "countryNamesPath" : "data/countrylist/list-water.csv",
    "dataPath" : "data/water-rural.csv",
    "hasTrend" : true,
    "trendStroke" : "#e9432e",
    "lm" : {
        _x1 : 0,
        _x2 : 430,
        _y1 : 172.11,
        _y2 : 90.28
    }
};
/**********************************/