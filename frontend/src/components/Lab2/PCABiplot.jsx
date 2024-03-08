import "../../App.css";
import React, { useEffect, useRef, useContext } from "react";
import * as d3 from "d3";
import { GlobalStoreContext } from "../../store/store.js";
import { Spinner } from "react-bootstrap";

function PCABiplot() {
  const d3Container = useRef(null);

  const { store, loading } = useContext(GlobalStoreContext);
  let data = store ? store.pca_scatterplot_data : [];
  let vectorData = store ? store.pca_scatterplot_vectors : [];
  useEffect(() => {
    const svg = d3.select(d3Container.current);

    // Set dimensions
    const margin = { top: 20, right: 20, bottom: 0, left: 20 };
    const width = 600 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const clusterIds = Array.from(new Set(data.map((d) => d.clusterId)));
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(clusterIds);
    const vectorNames = Array.from(new Set(vectorData.map((d) => d.name)));
    const colorScale2 = d3.scaleOrdinal(d3.schemeSet1).domain(vectorNames);

    // Clear SVG before redrawing
    svg.selectAll("*").remove();

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([
        -1 * d3.max(data, (d) => Math.abs(d.x)),
        d3.max(data, (d) => Math.abs(d.x)),
      ])
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([
        -1 * d3.max(data, (d) => Math.abs(d.y)),
        d3.max(data, (d) => Math.abs(d.y)),
      ])
      .range([height, 0]);

    // Draw gridlines
    chart
      .append("g")
      .selectAll("line.horizontalGrid")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "horizontalGrid")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d));

    chart
      .append("g")
      .selectAll("line.verticalGrid")
      .data(xScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "verticalGrid")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", 0)
      .attr("y2", height);

    // Draw data points
    chart
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 2)
      .attr("fill", (d) => colorScale(d.clusterId));
    // Draw vectors with arrows
    chart
      .selectAll(".vector")
      .data(vectorData)
      .enter()
      .append("line")
      .attr("class", "vector")
      .attr("stroke-width", 3)
      .attr("x1", xScale(0))
      .attr("y1", yScale(0))
      .attr("x2", (d) => xScale(d.x))
      .attr("y2", (d) => yScale(d.y))
      .attr("stroke", (d) => colorScale2(d.name))
      .attr("marker-end", "url(#arrow)");

    // Draw arrowheads
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5");

    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat((tick) => (tick !== 0 ? tick : ""));
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((tick) => (tick !== 0 ? tick : ""));
    chart
      .append("g")
      .attr("transform", `translate(0, ${height / 2})`)
      .call(xAxis);

    chart
      .append("g")
      .attr("transform", `translate(${width / 2}, 0 )`)
      .call(yAxis);

    // X axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2 + 20)
      .attr("y", 15)
      .text("PC 1");

    // Y axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", height / 2 + 50)
      .attr("x", width + 10)
      .text("PC 2");

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 100}, ${0})`);

    legend
      .selectAll(".legend")
      .data(vectorData)
      .enter()
      .append("rect")
      .attr("class", "legend")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d) => colorScale2(d.name));

    legend
      .selectAll(".legend-text")
      .data(vectorData)
      .enter()
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 20)
      .attr("y", (d, i) => i * 20 + 12)
      .text((d) => (d.name.length > 18 ? d.name.slice(0, 15) + "..." : d.name));
  }, [store]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#e6d7ff",
        boxShadow:
          "0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(61, 97, 82, 0.19)",
        borderRadius: "30px",
      }}
    >
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>PCA Biplot</h3>
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
        <svg
          className="d3-component"
          width={600}
          height={600}
          ref={d3Container}
        />
      )}
    </div>
  );
}

export default PCABiplot;
