import "../../App.css";
import React, { useEffect, useRef, useContext } from "react";
import { GlobalStoreContext } from "../../store/store.js";
import * as d3 from "d3";
import { Spinner } from "react-bootstrap";
// const dimensions = ["x1", "x2", "x3", "x4"];
function ScatterPlotMatrix({}) {
  const svgRef = useRef();

  const { store, loading } = useContext(GlobalStoreContext);

  let data = store ? store.scatterplot_matrix_data : [];
  let dimensions =
    data.length > 0
      ? Object.keys(data[0]).filter((d) => d !== "clusterId")
      : [];

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
          d3.min(data, (d) => d[dim]) - 0.05 * d3.max(data, (d) => d[dim]),
          d3.max(data, (d) => d[dim]) + 0.05 * d3.max(data, (d) => d[dim]),
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
            // .text(dim1.length > 18 ? dim1.substring(0, 15) + "..." : dim1)
            .text(dim1.length > 20 ? dim1.substring(0, 17) + "..." : dim1)
            .style("text-wrap", "wrap")
            .attr("class", "diagonal-label");
        }
      });
    });
  }, [store]);
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
      {loading ? (
        <div
          style={{
            height: "60%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner animation="border" />
        </div>
      ) : (
        <svg ref={svgRef}></svg>
      )}
    </div>
  );
}

export default ScatterPlotMatrix;
