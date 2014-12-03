var margin = {top: 20, right: 40, bottom: 20, left: 40};

var width = 1600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
	
var dataset = [	{unit: "kg", min: 15, norm: 30, max: 90, loss: -75, gain: 175},
				{unit: "kg", min: 15, norm: 30, max: 90, loss: -50, gain: 50},
				{unit: "kg", min: 15, norm: 30, max: 90, loss: -75, gain: 75},
				{unit: "kg", min: 15, norm: 30, max: 90, loss: -50, gain: 25},				
			   	{unit: "Min", min: 15, norm: 10, max: 5, loss: -25, gain: 50},
			   	{unit: "kg", min: 15, norm: 30, max: 90, loss: -200, gain: 100}];
	
var axish = 400,
    boxWidth = 150,
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
		    .attr("width", width)
		    .attr("height", height)
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
      			.attr("y", function(d, i) { return height/2 - (Math.abs(d.gain)); })
		      	.attr("height", function(d){return Math.abs(d.gain);})
		        .attr("width",  boxWidth)
		        .attr("class", "upperbox")
		      	.attr("fill", "yellowgreen")
		      	.attr("fill-opacity", lowOpacity);
		      	
var lowerBoxes = newg.append("rect")
			   	.attr("x", function(d, i) {return i * (boxWidth + padding) + margin.left;})
      			.attr("y", function(d) { return height/2; })
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
                .on("mousedown", buttonMouseDown)
                .on("mouseup", buttonMouseUp)
                .on("click", updateData);

    graphButton.append("rect")
                .attr("x", function(d, i) {return i * (boxWidth + padding) + margin.left + (boxWidth-buttonWidth)/2 ;})
                .attr("y", function(d, i) { return (height - buttonHeight)/2; })
                .attr("height", buttonHeight)
                .attr("width",  buttonWidth)
                .attr("rx", 5)
                .attr("ry", 5)               
                .style("fill", "white")
                .style("stroke", "grey")
                .style("fill-opacity", fullOpacity);
                
    graphButton.append("text")
                .attr("x", function(d, i) {return i * (boxWidth + padding) + margin.left + (boxWidth-buttonWidth)/2 + buttonWidth/6;})
                .attr("y", height/2 + buttonHeight/4)
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
      			  .attr("y", function(d) { return height/2 - Math.abs(d.gain); })
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
      			  .attr("y", function(d) { return height/2 + Math.abs(d.loss) - dragbarw; })
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
                     .range([0 ,2*width]);
                     
var yScale = d3.scale.linear()
                     .domain([-100,100])
                     .range([height/2 + axish/2 , height/2 - axish/2]);                    
                         
var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .tickSubdivide(3)
                  .orient("top");   
                  
var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .ticks(5)
                  .orient("left");                   
            
svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+ margin.left + "," + height/2 + ")")
        .style("stroke-dasharray", ("1, 3"))
        .call(xAxis);

svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+ margin.left + ", 0)")
        .style("stroke-dasharray", ("1, 50"))
        .call(yAxis);


//upper drag function			      
function tdragresize(d, i) {   
    var oldy = height/2 - (Math.abs(d.gain)),
        newy = d3.mouse(this)[1];    
    
    d3.select(this).attr("y",  newy );
    d3.select(this.parentNode).select(".upperbox").attr("y",  newy);
    d3.select(this.parentNode).select(".upperbox").attr("height", Math.abs(d.gain) + oldy - newy);
}

//lower drag function
function bdragresize(d) {    
    d3.select(this).attr("y",  d3.mouse(this)[1] - dragbarw );
    d3.select(this.parentNode).select(".lowerbox").attr("height", d3.mouse(this)[1] -height/2);
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

function buttonMouseDown(d) {
    d3.select(this).select("rect").style("fill-opacity", 1);
}

function buttonMouseUp(d) {
    d3.select(this).select("text").style("fill", "grey");
    d3.select(this).select("rect").style("fill-opacity", .5);
}

function updateData(d){
    
}
