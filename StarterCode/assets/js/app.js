// set svg Parameters
var svgWidth = 960;
var svgHeight = 500;
var margin = { top: 20, right: 40, bottom: 60, left: 100 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chart = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
d3.csv("assets/data/data.csv").then(healthdata => {
  healthdata.forEach(d => {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });
  //define scale
  var xScale = d3
    .scaleLinear()
    .domain([
      d3.min(healthdata, d => d.poverty) - 0.5,
      d3.max(healthdata, d => d.poverty) + 0.5,
      30
    ])
    .range([0, width]);

  var yScale = d3
    .scaleLinear()
    .domain([
      d3.min(healthdata, d => d.healthcare) - 1.0,
      d3.max(healthdata, d => d.healthcare) + 1.1
    ])
    .range([height, 0]);

  // define axes
  var bottomAxes = d3.axisBottom(xScale);
  var leftAxes = d3.axisLeft(yScale);
  chart
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(bottomAxes);
  chart.append("g").call(leftAxes);

  // plot data
  var groupCircles = chart
    .selectAll("circle")
    .data(healthdata)
    .enter();
  var circleToolTip = groupCircles
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", 15)
    .attr("opacity", ".5");

  // state abbr for each circle text
  var circleTip = groupCircles
    .append("text")
    .classed("stateText", true)
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.healthcare))
    .attr("stroke", "teal")
    .attr("font-size", "10px")
    .text(d => d.abbr);

  //tooltip
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(
      d =>
        `${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`
    );
  circleTip.call(toolTip);
  circleTip
    .on("mouseover", function(d) {
      d3.select(this).style("stroke", "black");
      toolTip.show(d, this);
    })
    .on("mouseout", function(d) {
      d3.select(this)
        .style("stroke", "blue")
        .attr("r", "10");
      toolTip.show(d);
    });
chart.append("text")
.attr("transform","rotate(-90)")
.attr("y",0-margin.left+40)
.attr("x",0-(height/2))
.attr("dy","1em")
.attr("class","axistext")
.text("lacks healthcare (%")
chart.append("text")
.attr("transform", `translate(${width/2}, ${height+margin.top +30})`)
.attr("class","axistext")
.text("poverty %")




});
