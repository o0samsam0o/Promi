var margin = {
    top : 20,
    right : 40,
    bottom : 20,
    left : 40
};

var width = 1600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var axish = 400,
    boxWidth = 150,
    dragbarw = 20,
    buttonWidth = 60,
    buttonHeight = 15;

var lChartHeight = 300,
    lChartWidth = 300;
    
var minyAxis = -100,
    maxyAxis = 100;

var padding = 15;

var isdragging = false,
    showLineChart = false;

var fullOpacity = 0.6,
    lowOpacity = 0.4;

//drag behavior
var dragTop = d3.behavior.drag()
    .origin(Object)
    .on("dragstart", dragstart)
    .on("drag", tdragresize)
    .on("dragend", dragend);

var dragBottom = d3.behavior
    .drag()
    .origin(Object)
    .on("dragstart", dragstart)
    .on("drag", bdragresize)
    .on("dragend", dragend);

//axes

var yScale = d3.scale.linear()
    .domain([minyAxis, maxyAxis])
    .range([height / 2 + lChartHeight / 2, height / 2 - lChartHeight / 2]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(5)
    .tickSize(15)
    .orient("left");

//add svg canvas
var svg = d3.select("body")
    .append("svg")
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
    .attr("x", function(d, i) { 
        return i * (boxWidth + padding) + 2 * margin.left;})
    .attr("y", function(d, i) { 
        return yScale(Math.abs(d.gain));})
    .attr("height", function(d) { 
        return (yScale(0) - yScale(Math.abs(d.gain)));})
    .attr("width", boxWidth)
    .attr("class", "upperbox")
    .attr("id", function(d, i) {return "upperbox" + i;})
    .attr("fill", "yellowgreen")
    .attr("fill-opacity", lowOpacity);

var lowerBoxes = newg.append("rect")
    .attr("x", function(d, i) { 
        return i * (boxWidth + padding) + 2 * margin.left;})
    .attr("y", yScale(0))
    .attr("height", function(d) { 
        return (yScale(0) - yScale(Math.abs(d.loss)));})
    .attr("width", boxWidth)
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
    .on("click", function(d,i){return updateLineChart(i);});

graphButton.append("rect")
    .attr("x", function(d, i) { 
            return i * (boxWidth + padding) + 2 * margin.left + 
            (boxWidth - buttonWidth) / 2;})
    .attr("y", yScale(0) - buttonHeight / 2)
    .attr("height", buttonHeight)
    .attr("width", buttonWidth)
    .attr("rx", 5).attr("ry", 5)
    .style("fill", "white")
    .style("stroke", "grey")
    .style("fill-opacity", fullOpacity);

graphButton.append("text")
    .attr("x", function(d, i) { 
            return i * (boxWidth + padding) + 2 * margin.left + 
            (boxWidth - buttonWidth) / 2 + buttonWidth / 6;})
    .attr("y", height / 2 + buttonHeight / 4)
    .style("fill", "grey")
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
    .attr("x", function(d, i) { 
            return i * (boxWidth + padding) + 2 * margin.left + 
            boxWidth / 2 - dragbarw / 2;})
    .attr("y", function(d) { return yScale(d.gain);})
    .attr("class", "upperdraghandle")
    .attr("width", dragbarw)
    .attr("height", dragbarw)
//  .style("stroke", "black")
    .attr("fill", "url(#dragUpPattern)")
    .attr("cursor", "ns-resize")
    .style("visibility", "hidden")
    .style("fill-opacity", fullOpacity)
    .call(dragTop);

var dragBarBottom = newg.append("rect")
    .attr("x", function(d, i) { 
            return i * (boxWidth + padding) + 2 * margin.left + 
            boxWidth / 2 - dragbarw / 2;})
    .attr("y", function(d) { return yScale(d.loss) - dragbarw;})
    .attr("class", "lowerdraghandle")
    .attr("width", dragbarw)
    .attr("height", dragbarw)
    .attr("fill", "url(#dragDownPattern)")
    .attr("cursor", "ns-resize")
    .style("visibility", "hidden")
    .style("fill-opacity", fullOpacity)
    .call(dragBottom);

//input boxes
var inputBoxes = d3.select("body")
    .data(dataset).enter()
    .append("input")
    .attr("type", "number")
    .attr("id", function(d, i) {return "input_upperbox" + i;})
    .attr("x", function(d, i) { return i * (boxWidth + padding) + margin.left;})
    .attr("y", "100px")
    .attr("min", 0)
    .attr("max", 100)
    .attr("step", "5")
    .attr("value", function(d) { return d.gain;})
    .on("input", function(d, i) { return updateUpperBoxHeight(i, this.value);});

//append axes
svg.append("line")//x-Axis
    .attr("class", "x axis")
    .attr("x1", margin.left)
    .attr("y1", yScale(0))
    .attr("x2", width)
    .attr("y2", yScale(0))
    .style("stroke", "grey")
    .style("stroke-dasharray", ("1, 3"));

svg.append("g")//y-Axis
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + ", 0)")
    .style("stroke-dasharray", ("1, 2"))
    .call(yAxis);

//drag functions
function dragstart() {
    isdragging = true;
}

function dragend() {
    isdragging = false;
}

//upper drag function  
var grid = 10;  //distance for snapping

function tdragresize() {
    var index = dataset.indexOf(this.__data__);
    
    var mousey = yScale.invert(d3.mouse(this)[1]), //scale mouse position
        newy = yScale(Math.round(mousey / grid) * grid), //snap to grid
        maxNewy = Math.max(Math.min(yScale(10), newy), yScale(100)), //upper(100) and lower(10) boundary
        newHeight =  yScale(0) - maxNewy;
    
    var newValue = (newHeight * maxyAxis) / (lChartHeight/2) ;
        
    var id = d3.select(this.parentNode).select(".upperbox").attr("id");

    d3.select(this).attr("y", maxNewy);              //new drag handle position   
    d3.select(this.parentNode).select(".upperbox")  //new box height and position
        .attr("y", maxNewy)
        .attr("height", newHeight);
   
   dataset[index].gain = newValue;
   updateInputBoxes(id, newValue);
   updateLineChart(index);
}

//lower drag function
function bdragresize() {
    var index = dataset.indexOf(this.__data__);
    
    var mousey = yScale.invert(d3.mouse(this)[1]), //scale mouse position
        newy = yScale(Math.round(mousey / grid) * grid), //snap to grid
        maxHeight = Math.min(yScale(-100), Math.max(newy, yScale(-10)) ), //upper(100) and lower(10) boundary
        newHeight = maxHeight - yScale(0);
        
    var newValue = (newHeight * minyAxis) / (lChartHeight/2) ;
    
    d3.select(this).attr("y", maxHeight - dragbarw); //new drag handle position
    d3.select(this.parentNode).select(".lowerbox")   //new box height
        .attr("height", newHeight);
    
    dataset[index].loss = newValue;    
    console.log(newValue);
    updateLineChart(index);
}
                                                                                
//mouse events
function mouseover() {
    if (!isdragging) {
        //make handles visible and change opacity
        d3.select(this).selectAll("rect").attr("fill-opacity", fullOpacity);

        d3.select(this).selectAll(".upperdraghandle")
            .style("visibility", "visible");
        d3.select(this).selectAll(".lowerdraghandle")
            .style("visibility", "visible");

        d3.select(this).select(".graphButton").style("visibility", "visible");
    }
}

function mouseout() {
    if (!isdragging) {
        //make handles invisible and change opacity
        d3.select(this).selectAll(".upperdraghandle")
            .style("visibility", "hidden");

        d3.select(this).selectAll(".lowerdraghandle")
            .style("visibility", "hidden");

        d3.select(this).select(".graphButton")
            .style("visibility", "hidden");

        d3.select(this).selectAll("rect")
            .attr("fill-opacity", lowOpacity);
    }
}

function buttonMouseDown(d) {
    d3.select(this).select("rect").style("fill-opacity", 1);
}

function buttonMouseUp(d) {
    d3.select(this).select("text").style("fill", "grey");
    d3.select(this).select("rect").style("fill-opacity", .5);
}

function updateLineChart(index) {
    drawLineChart(index);
}
                                                                                
function updateUpperBoxHeight(i, newHeight) {
    updateLineChart(i);

    //selection starts with index = 1 not 0
    i = i + 1;
    d3.select("g:nth-of-type(" + i + ")").select(".upperdraghandle")
        .transition().attr("y", yScale(newHeight));

    d3.select("g:nth-of-type(" + i + ")").select(".upperbox").transition()
        .attr("y", yScale(newHeight))
        .attr("height", yScale(0) - yScale(newHeight));
   
}

function updateInputBoxes(i, value){
    
    d3.select("#input_" + i).attr("value", value);

}

