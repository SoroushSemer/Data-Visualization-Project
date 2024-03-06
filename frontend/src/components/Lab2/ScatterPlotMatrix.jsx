import "../../App.css";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const data = [
  { x1: 12, x2: 25, x3: 18, x4: 22, clusterId: 0 },
  { x1: 15, x2: 30, x3: 20, x4: 28, clusterId: 1 },
  { x1: 28, x2: 22, x3: 10, x4: 35, clusterId: 2 },
  { x1: 8, x2: 15, x3: 25, x4: 18, clusterId: 0 },
  { x1: 20, x2: 18, x3: 12, x4: 30, clusterId: 1 },
  { x1: 30, x2: 24, x3: 14, x4: 25, clusterId: 2 },
  { x1: 10, x2: 22, x3: 30, x4: 12, clusterId: 0 },
  { x1: 18, x2: 28, x3: 22, x4: 20, clusterId: 1 },
  { x1: 26, x2: 32, x3: 18, x4: 30, clusterId: 2 },
  { x1: 14, x2: 20, x3: 24, x4: 15, clusterId: 0 },
  { x1: 22, x2: 25, x3: 16, x4: 35, clusterId: 1 },
  { x1: 32, x2: 30, x3: 20, x4: 28, clusterId: 2 },
  { x1: 15, x2: 18, x3: 28, x4: 10, clusterId: 0 },
  { x1: 26, x2: 22, x3: 14, x4: 32, clusterId: 1 },
  { x1: 35, x2: 28, x3: 18, x4: 24, clusterId: 2 },
  { x1: 12, x2: 24, x3: 20, x4: 15, clusterId: 0 },
  { x1: 18, x2: 30, x3: 22, x4: 30, clusterId: 1 },
  { x1: 28, x2: 34, x3: 16, x4: 25, clusterId: 2 },
  { x1: 10, x2: 20, x3: 26, x4: 12, clusterId: 0 },
  { x1: 22, x2: 26, x3: 18, x4: 35, clusterId: 1 },
  { x1: 32, x2: 28, x3: 24, x4: 28, clusterId: 2 },
  { x1: 15, x2: 18, x3: 28, x4: 10, clusterId: 0 },
  { x1: 26, x2: 22, x3: 14, x4: 32, clusterId: 1 },
  { x1: 35, x2: 30, x3: 20, x4: 24, clusterId: 2 },
  { x1: 14, x2: 24, x3: 22, x4: 15, clusterId: 0 },
  { x1: 20, x2: 32, x3: 18, x4: 30, clusterId: 1 },
  { x1: 30, x2: 28, x3: 16, x4: 28, clusterId: 2 },
  { x1: 12, x2: 25, x3: 18, x4: 22, clusterId: 0 },
  { x1: 15, x2: 30, x3: 20, x4: 28, clusterId: 1 },
  { x1: 28, x2: 22, x3: 10, x4: 35, clusterId: 2 },
  { x1: 8, x2: 15, x3: 25, x4: 18, clusterId: 0 },
  { x1: 20, x2: 18, x3: 12, x4: 30, clusterId: 1 },
  { x1: 30, x2: 24, x3: 14, x4: 25, clusterId: 2 },
  { x1: 10, x2: 22, x3: 30, x4: 12, clusterId: 0 },
  { x1: 18, x2: 28, x3: 22, x4: 20, clusterId: 1 },
  { x1: 26, x2: 32, x3: 18, x4: 30, clusterId: 2 },
  { x1: 14, x2: 20, x3: 24, x4: 15, clusterId: 0 },
  { x1: 22, x2: 25, x3: 16, x4: 35, clusterId: 1 },
  { x1: 32, x2: 30, x3: 20, x4: 28, clusterId: 2 },
  { x1: 15, x2: 18, x3: 28, x4: 10, clusterId: 0 },
  { x1: 26, x2: 22, x3: 14, x4: 32, clusterId: 1 },
  { x1: 35, x2: 28, x3: 18, x4: 24, clusterId: 2 },
  { x1: 12, x2: 24, x3: 20, x4: 15, clusterId: 0 },
  { x1: 18, x2: 30, x3: 22, x4: 30, clusterId: 1 },
  { x1: 28, x2: 34, x3: 16, x4: 25, clusterId: 2 },
  { x1: 10, x2: 20, x3: 26, x4: 12, clusterId: 0 },
  { x1: 22, x2: 26, x3: 18, x4: 35, clusterId: 1 },
];
const dimensions = ["x1", "x2", "x3", "x4"];
function ScatterPlotMatrix({}) {
  const svgRef = useRef();

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 10, right: 60, bottom: 0, left: 10 }; // Adjust the right margin
    const width = 700 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;
    const size = width / dimensions.length;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right) // Adjust the total width
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.selectAll("*").remove(); // Clear svg for redrawing

    // Create scales
    const scales = {};
    dimensions.forEach((dim) => {
      scales[dim] = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d[dim]) - 3,
          d3.max(data, (d) => d[dim]) + 3,
        ])
        .range([0, size]);
    });

    // Create a color scale for each unique clusterId
    const clusterIds = Array.from(new Set(data.map((d) => d.clusterId)));
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(clusterIds);

    dimensions.forEach((dim1, i) => {
      dimensions.forEach((dim2, j) => {
        const xScale = scales[dim1];
        const yScale = scales[dim2];

        const marginBetweenGraphs = 10;
        const plotGroup = svg
          .append("g")
          .attr(
            "transform",
            `translate(${j * (size + marginBetweenGraphs) + margin.left}, ${
              i * (size + marginBetweenGraphs) + margin.top
            })`
          );

        // Draw the border around each scatter plot
        plotGroup
          .append("rect")
          .attr("class", "border")
          .attr("width", size)
          .attr("height", size)
          .attr("rx", 10)
          .attr("ry", 10)
          .style("fill", "#F3F8FF")
          .style("stroke", "#ddd")
          .style("stroke-width", 1);

        // Draw dots for the scatter plot with color based on clusterId
        plotGroup
          .selectAll(".dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", (d) => size - xScale(d[dim1])) // Adjusted to be size - xScale
          .attr("cy", (d) => yScale(d[dim2]))
          .attr("r", 2)
          .style("fill", (d) => colorScale(d.clusterId));

        // Add variable names across the diagonal
        if (i === j) {
          const text = plotGroup
            .append("text")
            .attr("x", size / 2)
            .attr("y", size / 2)
            .attr("dy", "0.35em")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text(dim1)
            .attr("class", "diagonal-label");
        }
      });
    });
  }, [data, dimensions]);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>
        Scatter Plot Matrix
      </h3>

      <svg ref={svgRef}></svg>
    </div>
  );
}

export default ScatterPlotMatrix;
