
var dataset = [	{id: "1", unit: "kg", min: 15, norm: 30, max: 90, loss: -75, gain: 175, weight: 250},
				{id: "2", unit: "kg", min: 15, norm: 30, max: 90, loss: -50, gain: 50, weight: 100},
				{id: "3", unit: "kg", min: 15, norm: 30, max: 90, loss: -75, gain: 75, weight: 150},
				{id: "4", unit: "kg", min: 15, norm: 30, max: 90, loss: -50, gain: 25, weight: 75},				
			   	{id: "5", unit: "Min", min: 15, norm: 10, max: 5, loss: -25, gain: 50, weight: 75},
			   	{id: "6", unit: "kg", min: 15, norm: 30, max: 90, loss: -200, gain: 100, weight: 300}];

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
	.domain([function(d){return d.min;}, function(d){return d.max;}])
    .range([0, width]);

var y = d3.scale.linear()
	.domain([function(d){return d.loss;}, function(d){return d.gain;}])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
    var line = d3.svg.line()
    .x(function(d) { return x(d.gain); })
    .y(function(d) { return y(d.max); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);


  svg.append("path")
      .datum(dataset)
      .attr("class", "line")
      .attr("d", line);

  
    