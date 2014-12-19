var selectedData;

//remove old lineChart before drawing new
function removeChart() {
    svg.selectAll("g.lineChart").remove();
}

function drawLineChart(i) {

    selectedData = [{
        x : dataset[i].min,
        y : dataset[i].loss
    }, {
        x : dataset[i].norm,
        y : 0
    }, {
        x : dataset[i].max,
        y : dataset[i].gain
    }];

    var dragPoint = d3.behavior.drag().origin(Object).on("dragstart", function() {
        d3.select(this).attr("cursor", "move");
    }).on("drag", dragPoints).on("dragend", function() {
        d3.select(this).attr("cursor", "pointer");
    });

    var lc_x = dataset.length * (boxWidth + padding) + 3 * margin.left,
        lc_y = yScale(0) - lChartHeight / 2;

    //x axis
    var xScale = d3.scale.linear().domain(d3.extent(selectedData, function(d) {
        return d.x;
    })).range([0, lChartWidth]);

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    //filled area under line path
    var area = d3.svg.area().x(function(d) {
        return xScale(d.x);
    }).y0(yScale(0)).y1(function(d) {
        return yScale(d.y);
    });

    var line = d3.svg.line().x(function(d) {
        return xScale(d.x);
    }).y(function(d) {
        return yScale(d.y);
    });

    //bring all the pieces together
    var lineChart = svg.append("g").attr("class", "lineChart");

    lineChart.append("path").attr("class", "line").attr("transform", "translate(" + lc_x + ", 0)").attr("d", line(selectedData));

    // Set the threshold
    svg.append("linearGradient").attr("id", "area-gradient").attr("gradientUnits", "userSpaceOnUse").attr("x1", xScale(0)).attr("y1", yScale(-100)).attr("x2", xScale(0)).attr("y2", yScale(100)).selectAll("stop").data([{
        offset : "0%",
        color : yellyDark
    }, {
        offset : "50%",
        color : yellyDark
    }, {
        offset : "50%",
        color : grasDark
    }, {
        offset : "100%",
        color : grasDark
    }]).enter().append("stop").attr("offset", function(d) {
        return d.offset;
    }).attr("stop-color", function(d) {
        return d.color;
    });

    lineChart.append("path").datum(selectedData).attr("class", "area").attr("transform", "translate(" + lc_x + ", 0)").attr("d", area).style("fill", "url(#area-gradient)");

    //norm-line
    lineChart.append("line").attr("class", "norm").attr("x1", xScale(selectedData[1].x) + lc_x).attr("y1", yScale(100)).attr("x2", xScale(selectedData[1].x) + lc_x).attr("y2", yScale(-100)).style("stroke-width", 1).style("shape-rendering", "crispEdges").style("stroke", "lightgrey");

    lineChart.selectAll("circle").data(selectedData).enter().append("circle").attr("r", 3.5).attr("cx", function(d) {
        return xScale(d.x);
    }).attr("cy", function(d) {
        return yScale(d.y);
    }).attr("transform", "translate(" + lc_x + ", 0)")
    //.attr("visibility", "hidden")
    .attr("cursor", "pointer").call(dragPoint);

    lineChart.append("g").attr("class", "x axis").attr("transform", "translate(" + lc_x + "," + (yScale(0) + lChartHeight / 2) + ")").style("stroke-dasharray", ("1, 20")).call(xAxis);

    lineChart.append("g").attr("class", "y axis").attr("transform", "translate(" + lc_x + ", 0)").style("stroke-dasharray", ("1, 25")).call(yAxis);

    lineChart.append("rect").attr("x", lc_x).attr("y", lc_y).attr("width", lChartWidth).attr("height", lChartHeight).style("fill", "none").style("stroke", "grey").style("shape-rendering", "crispEdges");


function dragPoints() {
    var index = selectedData.indexOf(this.__data__);
    var mousex = xScale.invert(d3.mouse(this)[0]),
        mousey = yScale.invert(d3.mouse(this)[1]),
        newx = xScale(Math.round(mousex / grid) * grid),
        newy = yScale(Math.round(mousey / grid) * grid);

    var maxHeight = Math.min(yScale(-100), Math.max(newy, yScale(100))),
        maxWidth = Math.min(Math.max(newx, xScale(selectedData[0].x)), xScale(selectedData[2].x) ),
        newHeight = maxHeight - yScale(0);

    d3.select(this).attr("cx", newx).attr("cy", newy);

    
     var newValuex = (maxWidth/lChartWidth) * (selectedData[2].x - selectedData[0].x) + selectedData[0].x;
     var newValuey = (newHeight * minyAxis) / (lChartHeight/2) ;

     selectedData[index].x = newValuex;
     selectedData[index].y = newValuey;

    d3.selectAll(".lineChart").select(".area").datum(selectedData).attr("d", area);
    d3.selectAll(".lineChart").select(".norm").datum(selectedData).attr("x1",  xScale(selectedData[1].x) + lc_x).attr("x2",  xScale(selectedData[1].x) + lc_x);
    d3.selectAll(".lineChart").select(".line").attr("d", line(selectedData));

    console.log("selectedData[0].x: " + xScale(selectedData[0].x));
    console.log("newx: " + newx);
    console.log("selectedData[2].x: " + xScale(selectedData[2].x));
}


function update(i) {
    
} 

}


