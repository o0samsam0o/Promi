var margin = {top: 30, right: 40, bottom: 30, left: 50},
    w = 1500 - margin.left - margin.right,
    h = 600 - margin.top - margin.bottom;
	
var dataset = [	{id: "1", unit: "kg", min: 15, norm: 30, max: 90, loss: -75, gain: 175, weight: 250},
				{id: "2", unit: "kg", min: 15, norm: 30, max: 90, loss: -50, gain: 50, weight: 100},
				{id: "3", unit: "kg", min: 15, norm: 30, max: 90, loss: -75, gain: 75, weight: 150},
				{id: "4", unit: "kg", min: 15, norm: 30, max: 90, loss: -50, gain: 25, weight: 75},				
			   	{id: "5", unit: "Min", min: 15, norm: 10, max: 5, loss: -25, gain: 50, weight: 75},
			   	{id: "6", unit: "kg", min: 15, norm: 30, max: 90, loss: -200, gain: 100, weight: 300}];
	
var boxWidth = 150,
	dragbarw = 20,
	buttonWidth = 60,
	buttonHeight = 15;

var padding = 15;

var isdragging = false;

var fullOpacity = 0.6,
    lowOpacity = 0.4;

//drag behavior
var dragTop = d3.behavior.drag()
				.origin(Object)
				.on("dragstart", function(d) {isdragging = true;})
				.on("drag", tdragresize)
				.on("dragend",  function(d) {isdragging = false;}); 
				
var dragBottom = d3.behavior.drag()
				   .origin(Object)
				   .on("dragstart", function(d) {isdragging = true;})
				   .on("drag", bdragresize)
				   .on("dragend",  function(d) {isdragging = false;}); 
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
		      	.attr("fill", "yellowgreen")
		      	.attr("fill-opacity", lowOpacity);
		      	
var lowerBoxes = newg.append("rect")
			   	.attr("x", function(d, i) {return i * (boxWidth + padding) + margin.left;})
      			.attr("y", function(d) { return h/2; })
		      	.attr("height", function(d){return Math.abs(d.loss);})
		        .attr("width",  boxWidth)
		        .attr("class", "lowerbox")
		      	.attr("fill", "lightpink")
		      	.attr("fill-opacity", lowOpacity);
		     
//append Graph button
var graphButton = newg.append("g")
                .attr("class", "graphButton")
                .style("visibility", "hidden")
                .attr("cursor", "pointer")
                .on("mouseover", buttonMouseOver)
                .on("click", buttonClick)
                .on("mouseout", buttonMouseOut);

    graphButton.append("rect")
                .attr("x", function(d, i) {return i * (boxWidth + padding) + margin.left + (boxWidth-buttonWidth)/2 ;})
                .attr("y", function(d, i) { return (h - buttonHeight)/2; })
                .attr("height", buttonHeight)
                .attr("width",  buttonWidth)
                .attr("rx", 5)
                .attr("ry", 5)               
                .style("fill", "white")
                .style("stroke", "grey")
                .style("fill-opacity", fullOpacity);
                
    graphButton.append("text")
                .attr("x", function(d, i) {return i * (boxWidth + padding) + margin.left + (boxWidth-buttonWidth)/2 + buttonWidth/6;})
                .attr("y", h/2 + buttonHeight/4)
                .style("fill", "grey")
                .style("font-size", 10)
                .text("GRAPH");

//background-image for drag handles			   	
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
			      .style("fill-opacity", fullOpacity)
			      .call(dragTop);
			       			   
var dragBarBottom = newg.append("rect")
				  .attr("x", function(d, i) {return i * (boxWidth + padding) + margin.left + boxWidth/2 - dragbarw/2;})
      			  .attr("y", function(d) { return h/2 + Math.abs(d.loss) - dragbarw; })
      			  .attr("class", "draghandle")
      			  .attr("width", dragbarw)
			      .attr("height", dragbarw)     
                  .attr("fill", "url(#dragDownPattern)")      
                  .attr("cursor", "ns-resize")
			      .style("visibility", "hidden")
			      .style("fill-opacity", fullOpacity)
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

//mouse events
function mouseover() {                  
    d3.select(this).selectAll("rect").attr("fill-opacity", fullOpacity);
    
    d3.select(this).selectAll(".draghandle").style("visibility", "visible");
                        
    d3.select(this).select(".graphButton")
                        .style("visibility", "visible");                    
}

function mouseout() {
    if(!isdragging){      
        d3.select(this).selectAll(".draghandle")
                       .style("visibility", "hidden");  
                       
        d3.select(this).select(".graphButton")
                        .style("visibility", "hidden");
               
        d3.select(this).selectAll("rect").attr("fill-opacity", lowOpacity);      
                    }  
}

function buttonMouseOver(d) {
    d3.select(this).select("rect").style("fill-opacity", 1);
}

function buttonMouseOut(d) {
    d3.select(this).select("rect").style("fill-opacity", .5);
}

function buttonClick(d) {
    
}
