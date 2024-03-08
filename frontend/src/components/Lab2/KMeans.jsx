import { useState } from "react";
import "../../App.css";
import React, { useRef, useEffect, useContext } from "react";
import * as d3 from "d3";
import { GlobalStoreContext } from "../../store/store.js";
import { Spinner } from "react-bootstrap";
const data = [
  { name: 1, value: 4845653.728431435 },
  { name: 2, value: 3160044.8903641594 },
  { name: 3, value: 2431542.199690805 },
  { name: 4, value: 2074681.0516268283 },
  { name: 5, value: 1850804.3616876488 },
  { name: 6, value: 1638208.4392672793 },
  { name: 7, value: 1469420.4562386281 },
  { name: 8, value: 1468186.7782083116 },
  { name: 9, value: 1315687.969187062 },
  { name: 10, value: 1350537.4477076337 },
];

function ScreePlot() {
  const d3Container = useRef(null);

  const { store, loading } = useContext(GlobalStoreContext);

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

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([height, 0]);

    chart
      .append("line")
      .attr("x1", xScale(3) + xScale.bandwidth() / 2)
      .attr("y1", 15)
      .attr("x2", xScale(3) + xScale.bandwidth() / 2)
      .attr("y2", height)
      .attr("stroke", "red")
      .attr("stroke-dasharray", "5")
      .attr("stroke-width", 2);

    chart
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", xScale(3) + xScale.bandwidth() / 2)
      .attr("y", 10)
      .attr("fill", "red")
      .text("Elbow");

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
      .attr("fill", (d) => (d.name === store.k ? "red" : "#31708E"))
      .on("click", (event, d) => store.setK(d.name));

    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    chart
      .append("g")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat((d) => (d !== 0 ? (d / 1000000).toString() + "M" : "0"))
      );
    // X axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2 + margin.left + 50)
      .attr("y", height + margin.top + 40)
      .text("k");

    // Y axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 50)
      .attr("x", -margin.top - height / 2 + 20)
      .text("Inertia");
  }, [store, loading]);
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
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>
        K-Means MSE Plot
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
        <svg
          className="d3-component"
          width={600}
          height={300}
          ref={d3Container}
        />
      )}
    </div>
  );
}

export default ScreePlot;
