import "../../App.css";
import React, { useRef, useEffect, useState, useContext } from "react";
import * as d3 from "d3";
import { GlobalStoreContext } from "../../store/store.js";
import { Spinner } from "react-bootstrap";

const data = [
  { name: "1", value: 0.5514290145458656 },
  { name: "2", value: 0.19203008594088147 },
  { name: "3", value: 0.10744483255892343 },
  { name: "4", value: 0.06565206863491825 },
  { name: "5", value: 0.02684900177093878 },
  { name: "6", value: 0.01969588747923961 },
  { name: "7", value: 0.014044315758132456 },
  { name: "8", value: 0.0075630830500168994 },
  { name: "9", value: 0.00668168062858621 },
  { name: "10", value: 0.003332456091618599 },
  { name: "11", value: 0.002705512454512182 },
  { name: "12", value: 0.0017831974109204876 },
  { name: "13", value: 0.000616666462419775 },
  { name: "14", value: 0.00017219721302628684 },
  { name: "15", value: 3.421477607784664e-33 },
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
      .attr("fill", (d) => (d.name == store.di ? "red" : "#31708E"))
      .on("click", (event, d) => (d.name !== "1" ? store.setDi(d.name) : null));

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
      <h3 style={{ textAlign: "center", marginTop: "20px" }}>PCA Scree Plot</h3>
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
