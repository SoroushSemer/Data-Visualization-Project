import "../../App.css";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const data = [
  { name: "1", value: 0.5 },
  { name: "2", value: 0.25 },
  { name: "3", value: 0.125 },
  { name: "4", value: 0.0625 },
  { name: "5", value: 0.0625 },
];

function ScreePlot() {
  const d3Container = useRef(null);

  useEffect(() => {
    const svg = d3.select(d3Container.current);

    // Set dimensions
    const margin = {
        top: 10,
        right: 0,
        bottom: 50,
        left: 70,
      },
      width = 390 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    const cumulativeSum = data.reduce(
      (acc, d, i) => acc.concat(i > 0 ? acc[i - 1] + d.value : d.value),
      []
    );
    // Clear SVG before redrawing
    svg.selectAll("*").remove();

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .range([0, width + margin.left])
      .domain(data.map((d) => d.name))
      .padding(0.1);

    const yScale = d3.scaleLinear().domain([0, 1.0]).range([height, 0]);

    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.name))
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.value))
      .attr("fill", "#31708E");

    chart
      .append("path")
      .datum(cumulativeSum)
      .attr("fill", "none")
      .attr("stroke", "#cc0000")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line()
          .x((d, i) => xScale(data[i].name) + xScale.bandwidth() / 2)
          .y((d) => yScale(d))
      );

    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    chart.append("g").call(d3.axisLeft(yScale));
    // X axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2 + margin.left + 50)
      .attr("y", height + margin.top + 40)
      .text("Principle Component Number");

    // Y axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 40)
      .attr("x", -margin.top - height / 2 + 20)
      .text("% of Explained Variance");
  });
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
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>PCA Scree Plot</h3>
      <svg
        className="d3-component"
        width={600}
        height={300}
        ref={d3Container}
      />
    </div>
  );
}

export default ScreePlot;
