function plotStates() {

    // Load in my states data!
    d3.csv("states.csv", function (data) {
        console.log("Before: ", data);
        var year = document.getElementById('year').value;
        var month = document.getElementById('month').value;
        data = data.filter(d => (d.year == year) & (d.month == month));
        console.log("After: ", data, data.length);

        // color.domain([0, 1, 2, 3]); // setting the range of the input data
        color.domain([0, 1, 2]);


        // Load GeoJSON data and merge with states data
        d3.json("us-states.json", function (json) {

            // Loop through each state data value in the .csv file
            for (var i = 0; i < data.length; i++) {

                // Grab State Name
                var dataState = data[i].state_name;

                // Grab data value 
                var dataValue = data[i].std_sentiment;

                // Find the corresponding state inside the GeoJSON
                for (var j = 0; j < json.features.length; j++) {
                    var jsonState = json.features[j].properties.name;

                    if (dataState == jsonState) {

                        // Copy the data value into the JSON
                        json.features[j].properties['sentiment'] = dataValue;

                        // Stop looking through the JSON
                        break;
                    }
                }
            }
            console.log('Features: ', json.features);

            // Bind the data to the SVG and create one path per GeoJSON feature
            svg.selectAll("path").remove();

            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("stroke", "#fff")
                .style("stroke-width", "1")
                .style("fill", (d) => {
                    // Get data value
                    var value = d.properties.sentiment;
                    if (value) {
                        temp = value * 255  
                        temp2 = 255-temp
                        return "rgb(" + temp2 + "," + temp + ", 0, 0.5)"
                    }
                    else{
                        return "grey"
                    }
                })
                .on('click', function (d) {
                    // var year = document.getElementById('year').value;
                    // var month = document.getElementById('month').value;
                    // state_data = data.filter(c => c.state_name == d.properties.name & (c.year == year) & (c.month == month))[0];
                    // var negativity = state_data.negativity;
                    // var positivity = state_data.positivity;
                    // var neutrality = state_data.neutrality;
                    // console.log(negativity, positivity, neutrality);
                    console.log("Kina click garis?");
                    // document.getElementById("info").innerHTML = d.properties.name + " Positive Sentiments: " + pos_sentiments + " Negative Sentiments: " + neg_sentitments;
                    // console.log("KAKA");
                    // console.log(d);
                })
                .on('mouseover', function(d) {
                    var year = document.getElementById('year').value;
                    var month = document.getElementById('month').value;
                    state_data = data.filter(c => c.state_name == d.properties.name & (c.year == year) & (c.month == month))[0];
                    var negativity = Math.round(state_data.negativity*100)/100;
                    var positivity = Math.round(state_data.positivity*100)/100;
                    var neutrality = Math.round(state_data.neutrality*100)/100;
                    
                    var tt_text =  positivity + ", " + neutrality + ", " + negativity;
                    
                    d3.select(this).transition().duration('50').attr('opacity', '0.85');
                    div.transition().duration(50).style("opacity", 1);

                    div.html(tt_text)
                        .style("left", (d3.event.pageX + 10) + "px")
                        .style("top", (d3.event.pageY - 15) + "px");

                })
                .on('mouseout', function (d, i) {
                    d3.select(this).transition()
                         .duration('50')
                         .attr('opacity', '1');
                    //Makes the new div disappear:
                    div.transition()
                         .duration('50')
                         .style("opacity", 0);
               });

            // plotPoints();

            var legend = d3.select("body").append("svg")
                .attr("class", "legend")
                .attr("width", 140)
                .attr("height", 200)
                .selectAll("g")
                .data(color.domain().slice())
                .enter()
                .append("g")
                .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .data(legendText)
                .attr("x", 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .text(function (d) { return d; });
        });

    });
}

function clearPoints() {
    d3.selectAll("circle").remove();
}

function plotPoints() {
    var colors = new Object({
        "1": "green",
        "-1": "red",
        "0": "blue"
    })
    d3.selectAll("circle").remove();

    var year = document.getElementById('year').value;
    var month = document.getElementById('month').value;
    // var state = document.getElementById('states').value;
    console.log("Printing value for: " + year + "-" + month);
    d3.csv("cities.csv", function (data) {
        console.log("Original data points: " + data.length);
        data = data.filter(d => projection([d.x_loc, d.y_loc]) != null & (d.year == year) & (d.month == month));
        console.log("Year data points: " + data.length);
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return projection([d.x_loc, d.y_loc])[0];
            })
            .attr("cy", function (d) {
                return projection([d.x_loc, d.y_loc])[1];
            })
            .attr("r", function (d) {
                return 2;
            })
            .style("fill", (d) => ((d.sentiment == 0.0) ? "yellow" : (d.sentiment > 0.0) ? "green" : "red"))
            .style("opacity", 0.85)

        // fade out tooltip on mouse out
        // if (d.sentiment == 0.0){"yellow"}
        // 		else if (d.sentiment)               

    });
}