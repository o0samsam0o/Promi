var data = [{attr:"min", x: 15, y: -75},
            {attr:"norm", x: 30, y: 0},
            {attr:"max", x: 90, y: 75}];
    
var lc_x = dataset.length*(boxWidth + padding) + 2*margin.left,
    lc_y = yScale(0) - lChartHeight/2;
        
var xScale = d3.scale.linear()
                .domain(d3.extent(data, function(d) { return d.x; }))
                .range([0, lChartWidth]);
                
var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom");  
                
//fill area under line path
var area = d3.svg.area()
    .x(function(d) { return xScale(d.x); })
    .y0(yScale(0))
    .y1(function(d) { return yScale(d.y); });    
    
var line = d3.svg.line()
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); });
        
//bring all the pieces together    
var lineChart = svg.append("g")
        .append("rect")
        .attr("x", lc_x)
        .attr("y", lc_y)
        .attr("width", lChartWidth)
        .attr("height", lChartHeight)
        .style("fill", "none")
        .style("stroke", "grey")
        .style("shape-rendering", "crispEdges");
        
     svg.append("path")
          .attr("class", "line")
          .attr("transform", "translate("+ lc_x + ", 0)")
          .attr("d", line(data));
          
     svg.append("path")
          .attr("class", "area")
          .style("fill-opacity", fullOpacity)
          .attr("transform", "translate("+ lc_x + ", 0)")
          .attr("d", area(data));
          
     svg.append("line")                      //norm-line
        .attr("class", "norm")
        .attr("x1", xScale(30)+lc_x)
        .attr("y1", yScale(100))
        .attr("x2", xScale(30)+lc_x)
        .attr("y2", yScale(-100))
        .style("stroke-width", 1)
        .style("shape-rendering", "crispEdges")
        .style("stroke", "lightgrey");
        
     svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate("+ lc_x + "," + (yScale(0) + lChartHeight/2) + ")")
          .style("stroke-dasharray", ("1, 20"))
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate("+ lc_x + ", 0)")
          .style("stroke-dasharray", ("1, 25"))
          .call(yAxis);

      

  
    