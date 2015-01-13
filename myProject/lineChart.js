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
    
    var minArray = [selectedData[0], selectedData[1]],
        maxArray = [selectedData[1], selectedData[2]];

    var dragPoint = d3.behavior.drag().origin(Object).on("dragstart", function() {
        d3.select(this).attr("cursor", "move");
    }).on("drag", dragPoints).on("dragend", function() {
        d3.select(this).attr("cursor", "pointer");
    });

    var lc_x = dataset.length * (boxWidth + padding) + 3 * margin.left,
        lc_y = yScale(0) - lChartHeight / 2;

    //x axis
    var xScale = d3.scale.linear().domain([selectedData[0].x, selectedData[2].x]).range([0, lChartWidth]);

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

    lineChart.append("path").attr("class", "minLine").attr("transform", "translate(" + lc_x + ", 0)").attr("d", line(minArray));
    lineChart.append("path").attr("class", "maxLine").attr("transform", "translate(" + lc_x + ", 0)").attr("d", line(maxArray));

    lineChart.append("path").datum(minArray).attr("class", "minArea").attr("transform", "translate(" + lc_x + ", 0)").attr("d", area).style("fill", yellyDark);
    lineChart.append("path").datum(maxArray).attr("class", "maxArea").attr("transform", "translate(" + lc_x + ", 0)").attr("d", area).style("fill", grasDark);

    //norm-line
    lineChart.append("line").attr("class", "norm").attr("x1", xScale(selectedData[1].x) + lc_x).attr("y1", yScale(100)).attr("x2", xScale(selectedData[1].x) + lc_x).attr("y2", yScale(-100));

    lineChart.selectAll("circle").data(selectedData).enter().append("circle").attr("class", "mainPoints").attr("r", 5.0).attr("cx", function(d) {
        return xScale(d.x);
    }).attr("cy", function(d) {
        return yScale(d.y);
    }).attr("transform", "translate(" + lc_x + ", 0)")
    //.attr("visibility", "hidden")
    .attr("cursor", "pointer").call(dragPoint);

    lineChart.append("g").attr("class", "x axis").attr("transform", "translate(" + lc_x + "," + (yScale(0) + lChartHeight / 2) + ")").call(xAxis);

    lineChart.append("g").attr("class", "y axis").attr("transform", "translate(" + lc_x + ", 0)").call(yAxis);

    lineChart.append("rect").attr("class", "canvas").attr("x", lc_x).attr("y", lc_y).attr("width", lChartWidth).attr("height", lChartHeight);


function dragPoints() {
    var index = selectedData.indexOf(this.__data__);
    var mousex = xScale.invert(d3.mouse(this)[0]),
        mousey = yScale.invert(d3.mouse(this)[1]),
        newx = xScale(Math.round(mousex / grid) * grid),
        newy = yScale(Math.round(mousey / grid) * grid);

    var maxHeight = Math.min(yScale(-100), Math.max(newy, yScale(100))),
        maxWidth = Math.min(Math.max(newx, xScale(selectedData[0].x)), xScale(selectedData[2].x) ),
        newHeight = maxHeight - yScale(0);
    
     var newValuex = (maxWidth/lChartWidth) * (selectedData[2].x - selectedData[0].x) + selectedData[0].x;
     var newValuey = (newHeight * minyAxis) / (lChartHeight/2) ;

    if(index == 0 || index == 2)
    {
        d3.select(this).attr("cy", maxHeight);
        selectedData[index].y = newValuey;
    }else if (index == 1)
    {
        d3.select(this).attr("cx", maxWidth);
        selectedData[index].x = newValuex;
    }


    d3.selectAll(".lineChart").select(".minArea").datum(minArray).attr("d", area);
    d3.selectAll(".lineChart").select(".maxArea").datum(maxArray).attr("d", area);
    d3.selectAll(".lineChart").select(".norm").datum(selectedData).attr("x1",  xScale(selectedData[1].x) + lc_x).attr("x2",  xScale(selectedData[1].x) + lc_x);
    d3.selectAll(".lineChart").select(".minLine").attr("d", line(minArray));
    d3.selectAll(".lineChart").select(".maxLine").attr("d", line(maxArray));

}

}


