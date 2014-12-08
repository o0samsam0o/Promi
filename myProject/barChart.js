var margin = {
    top : 20,
    right : 40,
    bottom : 20,
    left : 40
};

var width = 1600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var dataset = [{
    unit : "kg",
    min : 15,
    norm : 30,
    max : 90,
    loss : -50,
    gain : 75
}, {
    unit : "kg",
    min : 15,
    norm : 30,
    max : 90,
    loss : -25,
    gain : 50
}, {
    unit : "kg",
    min : 15,
    norm : 30,
    max : 90,
    loss : -75,
    gain : 75
}, {
    unit : "kg",
    min : 15,
    norm : 30,
    max : 90,
    loss : -50,
    gain : 25
}, {
    unit : "Min",
    min : 15,
    norm : 10,
    max : 5,
    loss : -25,
    gain : 50
}, {
    unit : "kg",
    min : 15,
    norm : 30,
    max : 90,
    loss : -100,
    gain : 100
}];

var data = [{
    attr : "min",
    x : 15,
    y : -75
}, {
    attr : "norm",
    x : 30,
    y : 0
}, {
    attr : "max",
    x : 90,
    y : 75
}];

var axish = 400,
    boxWidth = 150,
    dragbarw = 20,
    buttonWidth = 60,
    buttonHeight = 15;

var lChartHeight = 400,
    lChartWidth = 400;

var padding = 15;

var isdragging = false;

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
    .domain([-100, 100])
    .range([height / 2 + lChartHeight / 2, height / 2 - lChartHeight / 2]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(5)
    .tickSize(15)
    .orient("left");

var count = (function(d, i) {
    return i;
});

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
    .on("click", updateLineChart);

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
    .attr("x", function(d, i) { return i * (boxWidth + padding) + margin.left;})
    .attr("y", "100px")
    .attr("min", 0)
    .attr("max", 100)
    .attr("step", "5")
    .attr("value", function(d) { return d.gain;})
    .on("input", function(d, i) {updateUpperBoxHeight(i, +this.value);});

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

function tdragresize(d) {
    var mousey = yScale.invert(d3.mouse(this)[1]), //scale mouse position
        newy = yScale(Math.round(mousey / grid) * grid);

    d3.select(this).attr("y", newy);
    d3.select(this.parentNode).select(".upperbox")
        .attr("y", newy)
        .attr("height",yScale(0) - newy);
}

//lower drag function
function bdragresize(d) {
    var mousey = yScale.invert(d3.mouse(this)[1]);
    
    d3.select(this).attr("y", yScale(Math.round(mousey / grid) * grid) - dragbarw);
    d3.select(this.parentNode).select(".lowerbox")
        .attr("height", yScale(Math.round(mousey / grid) * grid) - yScale(0));
}

//mouse events
function mouseover() {
    if (!isdragging) {
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

function updateLineChart() {
    drawLineChart(data);
}
                                                                                
function updateUpperBoxHeight(i, newHeight) {
    dataset[i].gain = newHeight;

    //selection starts with index=1 not 0
    i = i + 1;
    d3.select("g:nth-of-type(" + i + ")").select(".upperdraghandle")
        .attr("y", yScale(newHeight));

    d3.select("g:nth-of-type(" + i + ")").select(".upperbox").transition()
        .attr("y", yScale(newHeight))
        .attr("height", yScale(0) - yScale(newHeight));

}

