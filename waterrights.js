
var sodaUrl = "https://data.wa.gov/resource/xc42-c7rk.json";

var thedata = {};

$(document).ready(function() {
    
    $.support.cors = true;
    
    /* Working on making this a "loading X records" message....
    
    
    $.getJSON(sodaURL, {
        $select = "sum(DOCUMENT_TYPE)",
        $group = "DOCUMENT_TYPE"
    }).done(function(data) {
        
        
    });
    */
    
    
    $.getJSON(sodaUrl, {
        $limit: "10000"
    })
    .done(function(data) {
        
        $("#introText").remove();
        
        thedata = data;
        
        var countyCounts = _.countBy(data, "county_name");
        var counties = _.uniq(data, "county_name");
        
        var max = 0;
        var numberOfCounties = counties.length;
        
        // Get the maximum value of applications per county, to
        //   appropriately set the numeric axis
        for (var countyidex in counties) {
            var countyName = counties[countyidex].county_name;
            var currentCount = countyCounts[countyName];
            
            if (currentCount > max) {
                max = currentCount;
            };
            
            counties[countyidex]['count'] = currentCount;
        };
        
        counties = _.sortBy(counties, 'count').reverse();
        
        var margin = {top: 40, right: 20, bottom: 20, left: 200},
            width = 500 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;
            
        var x = d3.scale.linear()
            .range([0, width]);

        var y = d3.scale.ordinal()
            .rangeRoundBands([0, height]);
            
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(10);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
            
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        x.domain([0, d3.max(counties, function(d) { return d.count; })]);
        y.domain(counties.map(function(d) { return d.county_name; }));
        
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em");

        svg.selectAll(".bar")
            .data(counties)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("width", function(d) { return x(d.count); })
            .attr("y", function(d) { return y(d.county_name); })
            .attr("height", 10);
              
    });
});