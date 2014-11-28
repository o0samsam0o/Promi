var margin = {top: 30, right: 40, bottom: 30, left: 50},
    w = 1500 - margin.left - margin.right,
    h = 600 - margin.top - margin.bottom;
	
var dataset = [	{unit: "kg", min: 15, norm: 30, max: 90, loss: -75, gain: 175, weight: 250},
				{unit: "kg", min: 15, norm: 30, max: 90, loss: -50, gain: 50, weight: 100},
				{unit: "kg", min: 15, norm: 30, max: 90, loss: -75, gain: 75, weight: 150},
				{unit: "kg", min: 15, norm: 30, max: 90, loss: -50, gain: 25, weight: 75},				
			   	{unit: "Min", min: 15, norm: 10, max: 5, loss: -25, gain: 50, weight: 75},
			   	{unit: "kg", min: 15, norm: 30, max: 90, loss: -200, gain: 100, weight: 300}];
	
var boxwidth = 100,
	dragbarw = 10;

var padding = 10;

var svg = d3.select("body").append("svg")
		    .attr("width", w)
		    .attr("height", h)
		    .append("g");

    
var newg = svg.selectAll("rect")
			  .data(dataset)
			  .enter()
			  .append("g");
     
var upperBoxes = newg.append("rect")
			   	.attr("x", function(d, i) {return i * (boxwidth + padding) + margin.left;})
      			.attr("y", function(d, i) { return h/2 - (Math.abs(d.gain)); })
		      	.attr("height", function(d){return Math.abs(d.gain);})
		        .attr("width",  boxwidth)
		      	.attr("fill", "lightgreen")
		      	.attr("fill-opacity", .5);
		      	
var lowerBoxes = newg.append("rect")
			   	.attr("x", function(d, i) {return i * (boxwidth + padding) + margin.left;})
      			.attr("y", function(d) { return h/2; })
		      	.attr("height", function(d){return Math.abs(d.loss);})
		        .attr("width",  boxwidth)
		      	.attr("fill", "lightpink")
		      	.attr("fill-opacity", .5);
			   	
var dragtop = newg.append("rect")
				  .attr("x", function(d, i) {return i * (boxwidth + padding) + margin.left;})
      			  .attr("y", function(d, i) { return h/2 - (Math.abs(d.gain)) - dragbarw/2; })
      			  .attr("width", dragbarw)
			      .attr("height", dragbarw)       
			      .attr("fill", "white") 
			      .attr("fill-opacity", 0) 
			      .attr("stroke", "black")
			      .attr("stroke-width", 1)
			      .attr("cursor", "ns-resize");
 			   
var dragbottom = newg.append("rect")
				  .attr("x", function(d, i) {return i * (boxwidth + padding) + margin.left;})
      			  .attr("y", function(d) { return h/2 + Math.abs(d.loss) - dragbarw/2; })
      			  .attr("width", dragbarw)
			      .attr("height", dragbarw)       
			      .attr("fill", "white") 
			      .attr("fill-opacity", 0) 
			      .attr("stroke", "black")
			      .attr("stroke-width", 1)
			      .attr("cursor", "ns-resize");
