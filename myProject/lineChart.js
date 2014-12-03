var data = [{attr:"min", x:15,y: -75},
            {attr:"norm", x: 30, y: 0},
            {attr:"max", x: 90, y: 75}];
 
 
var boxh = 400,
    boxw = 400;
    
var lc_x = dataset.length*(boxWidth + padding) + 2*margin.left,
    lc_y = height/2 - boxh/2;
    
var x = d3.scale.linear()
    .domain(d3.extent(data, function(d) { return d.x; }))
    .range([0, boxw]);

var y = d3.scale.linear()
    .domain([-100, 100])
    .range([boxh, 0]);   

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(5)
    .orient("bottom");
    
//fill area under line path
var area = d3.svg.area()
    .x(function(d) { return x(d.x); })
    .y0(boxh/2)
    .y1(function(d) { return y(d.y); });    
    
var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(5)
    .orient("left");


var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });
    
//bring all the pieces together    
var lineChart = svg.append("g")
        .append("rect")
        .attr("x", lc_x)
        .attr("y", lc_y)
        .attr("width", boxw)
        .attr("height", boxh)
        .style("fill", "none")
        .style("stroke", "grey");
        
    svg.append("path")
          .attr("class", "line")
          .attr("transform", "translate("+ lc_x + "," + lc_y + ")")
          .attr("d", line(data));
          
     svg.append("path")
          .attr("class", "area")
          .style("fill-opacity", fullOpacity)
          .attr("transform", "translate("+ lc_x + "," + lc_y + ")")
          .attr("d", area(data));
        
     svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate("+ lc_x + "," + (height/2 + boxh/2) + ")")
          .style("stroke-dasharray", ("1, 20"))
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate("+ lc_x + "," + lc_y + " )")
          .style("stroke-dasharray", ("1, 25"))
          .call(yAxis);

      

  
    