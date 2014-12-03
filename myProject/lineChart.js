// var data = [min:{x:15,y: -75}
            // norm:{x: 30, y: 0x}
            // max:{x: 90, y: 175}];
 
 
var boxh = 400,
    boxw = 400;
    
var lc_x = dataset.length*(boxWidth + padding) + 2*margin.left,
    lc_y = height/2 - boxh/2;
    
var x = d3.scale.linear()
    .domain([d3.min(dataset,function(d){return d.min;}), d3.max(dataset, function(d){return d.max;})])
    .range([0, boxw]);

var y = d3.scale.linear()
    .domain([-100, 100])
    .range([boxh, 0]);   

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(5)
    .orient("bottom");
    
var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(5)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return d.gain; })
    .y(function(d) { return d.max; })
    .interpolate("linear");
    
var lineChart = svg.append("g")
        .append("rect")
        .attr("x", lc_x)
        .attr("y", lc_y)
        .attr("width", boxw)
        .attr("height", boxh)
        .style("fill", "none")
        .style("stroke", "grey");
        
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

      svg.append("path")
          .attr("class", "line")
          .attr("transform", "translate("+ lc_x + "," + lc_y + ")")
          .attr("d", line(data));

  
    