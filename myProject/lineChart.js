function drawLineChart(i) {

var selectedData = [{
    x : dataset[i].min,
    y : dataset[i].loss
}, {
    x : dataset[i].norm,
    y : 0
}, {
    x : dataset[i].max,
    y : dataset[i].gain
}];

    //remove old lineChart before drawing new    
    svg.selectAll("g.lineChart").remove();

    var lc_x = dataset.length * (boxWidth + padding) + 3 * margin.left,
        lc_y = yScale(0) - lChartHeight / 2;

    //x axis
    var xScale = d3.scale.linear()
        .domain(d3.extent(selectedData, function(d) {return d.x;}))
        .range([0, lChartWidth]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
   
    //filled area under line path
    var area = d3.svg.area()
        .x(function(d) {return xScale(d.x);})
        .y0(yScale(0))
        .y1(function(d) {return yScale(d.y);});

    var line = d3.svg.line()
        .x(function(d) {return xScale(d.x);})
        .y(function(d) {return yScale(d.y);});

    //bring all the pieces together
    var lineChart = svg.append("g")        
        .attr("class", "lineChart");
        
    lineChart.append("path")
        .attr("class", "line")       
        .attr("transform", "translate(" + lc_x + ", 0)")       
        .attr("d", line(selectedData));
        
        // Set the threshold
    svg.append("linearGradient")                    
        .attr("id", "area-gradient")                
        .attr("gradientUnits", "userSpaceOnUse")    
        .attr("x1", xScale(0)).attr("y1", yScale(-100))             
        .attr("x2", xScale(0)).attr("y2", yScale(100))          
    .selectAll("stop")                              
        .data([                                     
            {offset: "0%", color: yellyDark},    
            {offset: "50%", color: yellyDark},   
            {offset: "50%", color: grasDark},  
            {offset: "100%", color: grasDark}  
        ])                                          
    .enter().append("stop")                         
        .attr("offset", function(d) { return d.offset; })       
        .attr("stop-color", function(d) { return d.color; });   

    lineChart.append("path")   
        .datum(selectedData)  
        .attr("class", "area")
        .attr("transform", "translate(" + lc_x + ", 0)")            
        .attr("d", area);


    //norm-line
    lineChart.append("line")
        .attr("class", "norm")
        .attr("x1", xScale(30) + lc_x)
        .attr("y1", yScale(100))
        .attr("x2", xScale(30) + lc_x)
        .attr("y2", yScale(-100))
        .style("stroke-width", 1)
        .style("shape-rendering", "crispEdges")
        .style("stroke", "lightgrey");

    lineChart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + lc_x + "," + (yScale(0) + lChartHeight / 2) + ")")
        .style("stroke-dasharray", ("1, 20"))
        .call(xAxis);

    lineChart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + lc_x + ", 0)")
        .style("stroke-dasharray", ("1, 25"))
        .call(yAxis);
           
    lineChart.append("rect")
        .attr("x", lc_x)
        .attr("y", lc_y)
        .attr("width", lChartWidth)
        .attr("height", lChartHeight)
        .style("fill", "none")
        .style("stroke", "grey")
        .style("shape-rendering", "crispEdges");

}

