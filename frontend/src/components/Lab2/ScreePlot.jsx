import "../../App.css";
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const data = [
  { name: "1", value: 0.46241026396558643 },
  { name: "2", value: 0.1952097800805896 },
  { name: "3", value: 0.15881458429259454 },
  { name: "4", value: 0.0590598788634283 },
  { name: "5", value: 0.04787083546722092 },
  { name: "6", value: 0.024660721053103258 },
  { name: "7", value: 0.017534090990535763 },
  { name: "8", value: 0.011501897917248408 },
  { name: "9", value: 0.0069027418744346085 },
  { name: "10", value: 0.005914516103345962 },
  { name: "11", value: 0.005283906715367118 },
  { name: "12", value: 0.002201276058597463 },
  { name: "13", value: 0.0013061216198419845 },
  { name: "14", value: 0.0007029664731524999 },
  { name: "15", value: 0.0003340570208010382 },
  { name: "16", value: 0.00023133885308675712 },
  { name: "17", value: 6.1022651065217675e-5 },
  { name: "18", value: 1.7052435776224022e-31 },
];

function ScreePlot() {
  const [selectedBar, setSelectedBar] = useState("4");
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
      .attr("fill", (d) => (d.name == selectedBar ? "red" : "#31708E"))
      .on("click", (event, d) =>
        d.name !== "1" ? setSelectedBar(d.name) : null
      );

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
