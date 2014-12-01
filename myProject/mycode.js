var margin = {top: 30, right: 40, bottom: 30, left: 50},
    w = 1500 - margin.left - margin.right,
    h = 600 - margin.top - margin.bottom;
	
var dataset = [	{id: "1", unit: "kg", min: 15, norm: 30, max: 90, loss: -75, gain: 175, weight: 250},
				{id: "2", unit: "kg", min: 15, norm: 30, max: 90, loss: -50, gain: 50, weight: 100},
				{id: "3", unit: "kg", min: 15, norm: 30, max: 90, loss: -75, gain: 75, weight: 150},
				{id: "4", unit: "kg", min: 15, norm: 30, max: 90, loss: -50, gain: 25, weight: 75},				
			   	{id: "5", unit: "Min", min: 15, norm: 10, max: 5, loss: -25, gain: 50, weight: 75},
			   	{id: "6", unit: "kg", min: 15, norm: 30, max: 90, loss: -200, gain: 100, weight: 300}];
	
var boxWidth = 100,
	dragbarw = 20;

var padding = 10;

//drag behavior
var dragTop = d3.behavior.drag()
				.origin(Object)
				.on("drag", tdragresize); 
				
var dragBottom = d3.behavior.drag()
				   .origin(Object)
				   .on("drag", bdragresize); 

//add svg canvas
var svg = d3.select("body").append("svg")
		    .attr("width", w)
		    .attr("height", h)
		    .append("g");

//add "g" for every data object
var newg = svg.selectAll("rect")
			  .data(dataset)
			  .enter()
			  .append("g")
			  .on("mouseover", mouseover)
			  .on("mouseout", mouseout);

//append boxes    
var upperBoxes = newg.append("rect")
			   	.attr("x", function(d, i) {return i * (boxWidth + padding) + margin.left;})
      			.attr("y", function(d, i) { return h/2 - (Math.abs(d.gain)); })
		      	.attr("height", function(d){return Math.abs(d.gain);})
		        .attr("width",  boxWidth)
		        .attr("class", "upperbox")
		      	.attr("fill", "lightgreen")
		      	.attr("fill-opacity", .5);
		      	
var lowerBoxes = newg.append("rect")
			   	.attr("x", function(d, i) {return i * (boxWidth + padding) + margin.left;})
      			.attr("y", function(d) { return h/2; })
		      	.attr("height", function(d){return Math.abs(d.loss);})
		        .attr("width",  boxWidth)
		        .attr("class", "lowerbox")
		      	.attr("fill", "lightpink")
		      	.attr("fill-opacity", .5);

//pattern for drag handles	(background-image)		   	
var dragUpPattern = svg.append("defs")
                          .append("pattern")
                          .attr("id", "dragUpPattern")
                          .attr("patternUnits", "objectBoundingBox")
                          .attr("width", dragbarw)
                          .attr("height", dragbarw)		
                          .append("image")   
                          .attr("width", dragbarw)
                          .attr("height", dragbarw)  
                          .attr("xlink:href", "img/arrow_up.png");
                            
var dragDownPattern = svg.append("defs")
                          .append("pattern")
                          .attr("id", "dragDownPattern")
                          .attr("patternUnits", "objectBoundingBox")
                          .attr("width", dragbarw)
                          .attr("height", dragbarw)     
                          .append("image")   
                          .attr("width", dragbarw)
                          .attr("height", dragbarw)  
                          .attr("xlink:href", "img/arrow_down.png");    	
			   	
//append drag handles			   	
var dragBarTop = newg.append("rect")
				  .attr("x", function(d, i) {return i * (boxWidth + padding) + margin.left + boxWidth/2 - dragbarw/2;})
      			  .attr("y", function(d) { return h/2 - Math.abs(d.gain); })
      			  .attr("class", "draghandle")
      			  .attr("width", dragbarw)
			      .attr("height", dragbarw) 
			      //.style("stroke", "black")     
			      .attr("fill", "url(#dragUpPattern)")      
			      .attr("cursor", "ns-resize")
			      .style("visibility", "hidden")
			      .call(dragTop);
			       			   
var dragBarBottom = newg.append("rect")
				  .attr("x", function(d, i) {return i * (boxWidth + padding) + margin.left + boxWidth/2 - dragbarw/2;})
      			  .attr("y", function(d) { return h/2 + Math.abs(d.loss) - dragbarw; })
      			  .attr("class", "draghandle")
      			  .attr("width", dragbarw)
			      .attr("height", dragbarw)     
                  .attr("fill", "url(#dragDownPattern)")      
                  .attr("cursor", "ns-resize")
			      .attr("cursor", "ns-resize")
			      .style("visibility", "hidden")
			      .call(dragBottom);

//append axes
var xScale = d3.scale.linear()
                     .domain([0, 0])
                     .range([0 ,w]);
                     
var yScale = d3.scale.linear()
                     .domain([-100,100])
                     .range([h, 0]);                    
                         
var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("top");   
                  
var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .orient("left");                   
            
svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+ margin.left + "," + h/2 + ")")
        .style("stroke-dasharray", ("1, 3"))
        .call(xAxis);

svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+ margin.left + ", 0)")
        .style("stroke-dasharray", ("1, 1"))
        .call(yAxis);


//upper drag function			      
function tdragresize(d, i) {    
    var oldy = h/2 - (Math.abs(d.gain)),
        newy = d3.mouse(this)[1];    
    
    d3.select(this).attr("y",  newy );
    d3.select(this.parentNode).select(".upperbox").attr("y",  newy);
    d3.select(this.parentNode).select(".upperbox").attr("height", Math.abs(d.gain) + oldy - newy);
}

//lower drag function
function bdragresize(d) {    
    d3.select(this).attr("y",  d3.mouse(this)[1] - dragbarw );
    d3.select(this.parentNode).select(".lowerbox").attr("height", d3.mouse(this)[1] -h/2);
}

function mouseover() {
    d3.select(this).selectAll(".draghandle")
                    .style("visibility", "visible");
}

function mouseout() {
    d3.select(this).selectAll(".draghandle")
                    .style("visibility", "hidden");
}
