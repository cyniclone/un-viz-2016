/***** Static Content ************/
var xs, ys, rs, debug = { debug : true, xs : xs, ys : ys , rs : rs }; // Object for debugging and calculating trend lines

var charts = {}; // Object to hold all chart objects

/*******************************************
 *  SINGLE SCATTERS
 *******************************************/

/***** 1 NO POVERTY ************/
//(Intercept)         Year
//1488.8455333   -0.7350615

charts["poverty"] = {
    "year" : { begin : "1980", end: "2015" },
    "n"     : 1,
    "value" : "poverty",
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
    "countryNamesPath" : "data/countrylist/list-poverty.csv",
    "dataPath" : "data/poverty.csv",
    "hasTrend" : true,
    "trendStroke" : "#222",
    "lm" : {
        slope : -0.7350615,
        intercept : 1488.8455333
    }
};

/***** 2 ZERO HUNGER ************/

//(Intercept)         Year
//1012.8755183   -0.4961083
charts["hunger"] = {
    "year" : { begin : "1990", end: "2015"},
    "n"     : 1,
    "value" : "hunger",
    "navText" : "Zero Hunger",
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
        slope : -0.4961083,
        intercept : 1012.8755183
    }
};

/***** 3 GOOD HEALTH AND WELL-BEING ************/

charts["childMortality"] = {
    "year" : { begin : "1960", end: "2015"},
    "n"     : 1,
    "customFormat" : d3.format("0,000"),
    "yMin" : 0,
    "yMax" : 450,
    "value" : "child-mortality",
    "targetDiv" : "#chart",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 40,
            bottom: 30,
            left: 50
        },
        "width" : 850,
        "height" : 800
    },
    "radius" : 5,
    "countryNamesPath" : "data/countrylist/list-child-mortality.csv",
    "dataPath" : "data/child-mortality.csv",
    "hasTrend" : false,
    "hasLoess" : true
};

/***** 12 RESPONSIBLE CONSUMPTION AND PRODUCTION ************/

charts["consumption"] = {
    "n"     : 1,
    //"customFormat" : d3.format("0,000"),
    "useCustomX" : true,
    "xMin" : 0,
    "xMax" : 3000,
    "useCustomR" : true,
    //"rMin" : 4,
    //"rMax" : 32,
    "rRange" : [4, 32],
    "xParam" : "SubPerCapita",
    "yParam" : "AverageSubRate",
    "rParam" : "SubPercGdp",
    "value" : "consumption",
    "targetDiv" : "#chart",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 40,
            bottom: 30,
            left: 50
        },
        "width" : 850,
        "height" : 800
    },
    //"countryNamesPath" : "data/countrylist/list-consumption.csv",
    "dataPath" : "data/consumption.csv",
    "hasTrend" : false,
};

/***** 13 CLIMATE ACTION ************/
// (Intercept)        Year
// -54.3101900   0.0295105

charts["climate"] = {
    "year" : { begin : "1960", end: "2011"},
    "n"     : 1,
    "value" : "climate",
    "targetDiv" : "#chart",
    "xTicks" : 10,
    "customFormat" : d3.format("00"),
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
    //"header" : "ZERO HUNGER",
    "countryNamesPath" : "data/countrylist/list-climate.csv",
    "dataPath" : "data/climate.csv",
    "hasTrend" : true,
    "trendStroke" : "#222",
    "lm" : {
        slope : 0.0295105,
        intercept :  -54.310190
    }
};

/*******************************************
*  DUAL SCATTERS
*******************************************/



/***** 4 QUALITY EDUCATION ************/

//Coefficients:
//(Intercept)         Year
//-2334.707610     1.203078
charts["educationf"] = {
    "yMin" : 0,
    "yMax" : 180,
    "year" : { begin : "1970", end: "2015"},
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
        "width" : 550,
        "height" : 600
    },
    "radius" : 3,
    "header" : "QUALITY EDUCATION",
    "countryNamesPath" : "data/countrylist/list-education.csv",
    "dataPath" : "data/education-f.csv",
    "hasTrend" : true,
    "trendStroke" : "#222",
    "lm" : {
        slope : 1.203078,
        intercept : -2334.707610
    }
};

//Coefficients:
//(Intercept)         Year
//-2005.485657     1.039033
charts["educationm"] = {
    "yMin" : 0,
    "yMax" : 180,
    "year" : { begin : "1970", end: "2015"},
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
        "width" : 550,
        "height" : 600
    },
    "radius" : 3,
    "header" : "QUALITY EDUCATION",
    "countryNamesPath" : "data/countrylist/list-education.csv",
    "dataPath" : "data/education-m.csv",
    "hasTrend" : true,
    "trendStroke" : "#222",
    "lm" : {
        slope : 1.039033,
        intercept : -2005.485657
    }
};

/***** 5 GENDER EQUALITY **********/
//(Intercept)         Year
//142.11647817  -0.06818827
charts["genderf"] = {
    "year" : { begin : "2000", end: "2013" },
    "n"     : 1,
    "xTicks" : 3,
    "yTicks" : 5,
    "yMax" : 25,
    "value" : "genderf",
    "targetDiv" : "#chart",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        "width" : 550,
        "height" : 600
    },
    "radius" : 5,
    "countryNamesPath" : "data/countrylist/list-gender.csv",
    "dataPath" : "data/gender-f.csv",
    "hasTrend" : true,
    "trendStroke" : "#222",
    "lm" : {
        slope : -0.06818827,
        intercept : 142.11647817
    }
};
//(Intercept)        Year
//346.898836   -0.168159
charts["genderm"] = {
    "year" : { begin : "2000", end: "2013" },
    "n"     : 2,
    "xTicks" : 3,
    "yTicks" : 5,
    "yMax" : 25,
    "value" : "genderm",
    "targetDiv" : "#chart2",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        "width" : 550,
        "height" : 600
    },
    "radius" : 5,
    "countryNamesPath" : "data/countrylist/list-gender.csv",
    "dataPath" : "data/gender-m.csv",
    "hasTrend" : true,
    "trendStroke" : "#222",
    "lm" : {
        slope : -0.168159,
        intercept : 346.898836
    }
};
charts["genderBars"] = {
    "percentSuffix" : true,
    "hasAverage" : true,
    "xDomain" : [0, 45],
    "dataPath" : "data/gender-forbes.csv",
    "targetDiv" : "#bar-chart",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 60,
            bottom: 10,
            left: 100
        },
        "width" : 1100,
        "height" : 900
    },
};



/***** 6 WATER ACCESS  ************/

// (Intercept)         Year
// -719.5411747    0.4014397
charts["waterg"] = {
    "year" : { begin : "1990", end: "2016"},
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
    "xTicks" : 5,
    "radius" : 3,
    "countryNamesPath" : "data/countrylist/list-water.csv",
    "dataPath" : "data/water-general.csv",
    "hasTrend" : true,
    "trendStroke" : "#e9432e",
    "lm" : {
        slope : 0.4014397,
        intercept : -719.5411747,
    }
};

// (Intercept)         Year
// -972.5403630    0.5245499
charts["waterr"] = {
    "year" : { begin : "1990", end: "2016"},
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
    "xTicks" : 5,
    "radius" : 3,
    "countryNamesPath" : "data/countrylist/list-water.csv",
    "dataPath" : "data/water-rural.csv",
    "hasTrend" : true,
    "trendStroke" : "#e9432e",
    "lm" : {
        slope : 0.5245499,
        intercept : -972.5403630,
    }
};

/***** 7 Access to Energy ************/
charts["energy"] = {
    "year": {begin: "1990", end: "2015"},
    "n": 1,
    "value": "energy",
    "targetDiv": "#chart",
    "dimensions": {
        "margin": {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        "width": 800,
        "height": 800
    },
    "radius": 4,
    "countryNamesPath" : "data/countrylist/list-energy.csv",
    "dataPath": "data/energy.csv",
    "hasTrend": false,
}

/***** 8 DecentWorkandEconomicGrowth ************/

// LABOR FORCE PARTICIPATION
//(Intercept)         Year
//-316.4548911    0.1836041
    charts["laborf"] = {
        "year" : { begin : "1990", end: "2015"},
        "n"     : 1,
        "value" : "laborf",
        "targetDiv" : "#chart",
        "dimensions" : {
            "margin" : {
                top : 20,
                right: 20,
                bottom: 30,
                left: 50
            },
            "width" : 550,
            "height" : 600
        },
        "radius" : 4,
        "countryNamesPath" : "data/countrylist/list-labor.csv",
        "dataPath" : "data/labor-f.csv",
        "hasTrend" : true,
        "trendStroke" : "#fbb900",
        "lm" : {
            slope : 0.1836041,
            intercept : -316.4548911
        }
    };

//(Intercept)        Year
//314.7779211  -0.1194259
charts["laborm"] = {
    "year" : { begin : "1990", end: "2015"},
    "n"     : 2,
    "value" : "laborm",
    "targetDiv" : "#chart2",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        "width" : 550,
        "height" : 600
    },
    "radius" : 4,
    "countryNamesPath" : "data/countrylist/list-labor.csv",
    "dataPath" : "data/labor-m.csv",
    "hasTrend" : true,
    "trendStroke" : "#fbb900",
    "lm" : {
        slope : -0.1194259,
        intercept : 314.7779211
    }
};

/***** 9 INNOVATION ************/
//(Intercept)        Year
//-86639.1766     44.7679
charts["innovation1"] = {
    "year" : { begin : "1995", end: "2015" },
    "n"     : 1,
    "xTicks" : 4,
    "yTicks" : 5,
    "yMin" : 0,
    "yMax" : 12000,
    "customFormat" : d3.format("0,000"),
    "value" : "innovation1",
    "targetDiv" : "#chart",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        "width" : 550,
        "height" : 700
    },
    "radius" : 4,
    "countryNamesPath" : "data/countrylist/list-innovation.csv",
    "dataPath" : "data/innovation-1.csv",
    "hasTrend" : true,
    "trendStroke" : "#164767",
    "lm" : {
        slope : 44.7679,
        intercept : -86639.1766
    }
};

//(Intercept)        Year
//321.3985181  -0.1411941
charts["innovation2"] = {
    "year" : { begin : "1995", end: "2015" },
    "n"     : 2,
    "xTicks" : 4,
    "yTicks" : 3,
    "yMin" : 0,
    "yMax" : 60,
    "value" : "innovation2",
    "targetDiv" : "#chart2",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        "width" : 550,
        "height" : 700
    },
    "radius" : 4,
    "countryNamesPath" : "data/countrylist/list-innovation.csv",
    "dataPath" : "data/innovation-2.csv",
    "hasTrend" : true,
    "trendStroke" : "#164767",
    "lm" : {
        slope : -0.1411941,
        intercept : 321.398518
    }
};


/***** bar charts ************/

// INEQUALITY
charts["inequality"] = {
    //"year" : { begin : "1990", end: "2016"},
    "n"     : 1,
    "value" : "inequality",
    "targetDiv" : "#chart",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 20,
            bottom: 20,
            left: 120
        },
        "width" : 800,
        "height" : 900
    },
    //"xTicks" : 5,
    "radius" : 3,
    //"countryNamesPath" : "data/countrylist/list-inequality.csv",
    "dataPath" : "data/inequality.csv",
};

/***** 14 LIFE BELOW WATER ***********/
charts["fish"] = {
    "dataPath" : "data/fish.csv",
    "targetDiv" : "#bar-chart",
    "xDomain" : [0, 250],
    "xTicks" : 5,
    "dimensions" : {
        "margin" : {
            top : 30,
            right: 60,
            bottom: 10,
            left: 150
        },
        "width" : 1100,
        "height" : 900
    },
};
/**********************************/