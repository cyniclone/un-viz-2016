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
    "useCustomX" : true,
    "xMin" : 0,
    "xMax" : 3000,
    "useCustomR" : true,
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
    "countryNamesPath" : "data/countrylist/list-consumption.csv",
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
    "tipText" : " tons",
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
    "hasSuffix" : true,
    "suffix" : "%",
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
    "year": {begin: "1990", end: "2012"},
    "n": 1,
    "xTicks" : 5,
    "value": "energy",
    "targetDiv": "#chart",
    "dimensions": {
        "margin": {
            top: 40,
            right: 20,
            bottom: 30,
            left: 50
        },
        "width": 500,
        "height": 400
    },
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
    "trendStroke" : "#222",
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
    "trendStroke" : "#222",
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
    "radius" : 6,
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
    "radius" : 6,
    "countryNamesPath" : "data/countrylist/list-innovation.csv",
    "dataPath" : "data/innovation-2.csv",
    "hasTrend" : true,
    "trendStroke" : "#164767",
    "lm" : {
        slope : -0.1411941,
        intercept : 321.398518
    }
};

/***** 11 Sustainable Cities and Communities ************/
charts["sustainable"] = {
    "path" : {
        "csv" : "data/sustainable.csv",
        "topo" : "data/json/world-topo.topojson"
    },
    "mapParam" : "PM2p5",
    "numQuantiles" : 7,
    "dimensions" : {
        "margin" : { top : 20,  right: 20,  bottom: 30,  left: 50 },
        "width" : 1100,
        "height" : 525
    },
    "legend" : {
        "dimensions" : {
            "margin" : { top : 10,  right: 20,  bottom: 40,  left: 20 },
            "width" : 1100,
            "height" : 90
        }
    },
    "tooltipText" : " micrograms",
    "domain" : [6, 12, 24, 36, 60, 75],
    "legendData" : [0, 6, 12, 24, 36, 60, 75, 110],
    "legendLabel" : "Micrograms of particles (smaller than 2.5 microns) per cubic meter of air"
};
charts["sustainableBars"] = {
    "hasSuffix" : true,
    "suffix" : " µg",
    "tipText" : " µg / m³ of air",
    "xDomain" : [0, 100],
    "dataPath" : "data/sustainable-bars.csv",
    "targetDiv" : "#bar-chart",
    "dimensions" : {
        "margin" : {
            top : 20,
            right: 60,
            bottom: 10,
            left: 150
        },
        "width" : 1100,
        "height" : 600
    }
};

// INEQUALITY
charts["inequality"] = {
    "xTickValues" : [-5, -4, -2, 0, 2, 4, 6, 8, 10, 12],
    "xDomain" : [-5, 12],
    "value" : "inequality",
    "dimensions" : {
        "margin" : {
            top : 0,
            right: 20,
            bottom: 0,
            left: 250
        },
        "width" : 900,
        "heightPerTick" : 30
    },
    "radius" : 3,
    "dataPath" : "data/inequality.csv",
};

/***** 14 LIFE BELOW WATER ***********/
charts["fish"] = {
    "dataPath" : "data/fish.csv",
    "targetDiv" : "#bar-chart",
    "xDomain" : [0, 250],
    "xTicks" : 5,
    "tipText" : " threatened species",
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

/***** 15 LIFE ON LAND ************/
charts["land"] = {
    "path" : {
        "csv" : "data/land.csv",
        "topo" : "data/json/world-topo.topojson"
    },
    "mapParam" : "2013",
    "numQuantiles" : 7,
    "dimensions" : {
        "margin" : { top : 20,  right: 20,  bottom: 30,  left: 50 },
        "width" : 1100,
        "height" : 525
    },
    "legend" : {
        "dimensions" : {
            "margin" : { top : 10,  right: 20,  bottom: 40,  left: 20 },
            "width" : 1100,
            "height" : 90
        }
    },
    "tooltipText" : " %",
    "suffix" : "%",
    "domain" : [16, 26, 36, 48, 60, 75],
    "legendData" : [0, 16, 26, 36, 48, 60, 75, 100],
    "legendLabel" : "Percentage of total country surface"
};
charts["landLine"] = {
    "dimensions" : {
        "margin" : { top : 20,  right: 90,  bottom: 30,  left: 90 },
        "width" : 950,
        "height" : 350
    },
    "path" : {
        "csv": "data/land-line.csv"
    },
    "kilometers" : {
        "values" : [39.0, 40.0, 41.0, 42.0],
        "domain" : [38, 42.5]
    },
    "miles" : {
        "values" : [15.0, 15.5, 16.0],
        "domain" : [14.6719, 16.40934]
    },
    "years" : [1990, 2000, 2006, 2008, 2010, 2012]
}

/***** 16 PEACE AND JUSTICE STRONG INSTITUTIONS ************/
charts["birthRegistration"] = {
    "targetDiv" : "#chart",
    "yTicks" : 5,
    "dimensions" : {
        "margin" : { top : 20,  right: 40,  bottom: 30,  left: 50 },
        "width" : 800,
        "height" : 700
    },
    "radius" : 8,
    "countryNamesPath" : "data/countrylist/list-birth-registration.csv",
    "dataPath" : "data/birth-registration.csv",
    "hasLoess" : true,
    "loessPath" : "data/loess/loess-birth-registration.csv",
    "trendStroke" : "#fab600"
}

/***** 17 PARTNERSHIPS ************/
//(Intercept)        Year
//-304.677140    0.168924

charts["partnerships"] = {
    "targetDiv" : "#chart",
    "yTicks" : 6,
    "yMin" : 0,
    "yMax" : 60,
    "dimensions" : {
        "margin" : { top : 20,  right: 40,  bottom: 30,  left: 50 },
        "width" : 800,
        "height" : 700
    },
    "radius" : 5,
    "countryNamesPath" : "data/countrylist/list-partnerships.csv",
    "dataPath" : "data/partnerships.csv",
    "hasTrend" : true,
    "trendStroke" : "#FFD200",
    "lm" : {
        slope : 0.168924,
        intercept : -304.677140
    }
}