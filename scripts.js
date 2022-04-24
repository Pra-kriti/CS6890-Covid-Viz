//Width and height of map
var width = 1400;
var height = 730;

// 960/500 = 1.92

// D3 Projection
var projection = d3.geo.albersUsa()
    .translate([width/2 +150, height / 2])    // translate to center of screen
    .scale([1700]);          // scale things down so see entire US

// Define path generator
var path = d3.geo.path()       // path generator that will convert GeoJSON to SVG paths
    .projection(projection);  // tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Define linear scale for output
var color = d3.scale.linear()
    .range(["green", "yellow", "red"]);

// var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];
var legendText = ['Positive', 'Neutral', 'Negative'];


var div = d3.select("body").append("div")
    .attr("class", "tooltip-map")
    .style("opacity", 0)

plotStates();



document.addEventListener('DOMContentLoaded', function () {
    var checkbox = document.querySelector('input[type="checkbox"]');
  
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        plotPoints();
      } else {
        clearPoints();
      }
    });
  });