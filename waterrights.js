
var sodaUrl = "https://data.wa.gov/resource/xc42-c7rk.json";

var thedata = {};

$(document).ready(function() {
    
    $.support.cors = true;
    $.getJSON(sodaUrl)
    .done(function(data) {
        
        thedata = data;
        
        var countyCounts = _.countBy(data, "county_name");
        var counties = _.uniq(data, "county_name");
        
        var max = 0;
        var numberOfCounties = counties.length;
        
        for (var countyidex in counties) {
            var countyName = counties[countyidex].county_name;
            var currentCount = countyCounts[countyName];
            
            if (currentCount > max) {
                max = currentCount;
            };
            
            counties[countyidex]['count'] = currentCount;
        };
        
        counties = _.sortBy(counties, 'count').reverse();
        
        var margin = {top: 20, right: 20, bottom: 200, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
            
        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);
            
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        x.domain(counties.map(function(d) { return d.county_name; }));
        y.domain([0, d3.max(counties, function(d) { return d.count; })]);
        
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)" );

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Y Axis!");

        svg.selectAll(".bar")
            .data(counties)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.county_name); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.count); })
            .attr("height", function(d) { return height - y(d.count); });
              
    });
});