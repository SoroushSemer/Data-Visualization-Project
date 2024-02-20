import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Scatterplot = ({ givenData, independentVar, dependentVar }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (givenData && d3Container.current) {
      const svg = d3.select(d3Container.current);
      const independentIsNumerical = givenData.every(
        (row) => !isNaN(parseFloat(row[independentVar])) || !row[independentVar]
      );
      const dependentIsNumerical = givenData.every(
        (row) => !isNaN(parseFloat(row[dependentVar])) || !row[dependentVar]
      );

      let x_data = [];
      let y_data = [];
      let x_labels = [];
      let y_labels = [];

      if (independentIsNumerical) {
        givenData.forEach((row) =>
          x_data.push(parseFloat(row[independentVar]))
        );
      } else {
        let uniqueObj = {};
        let i = 1;
        givenData.forEach((row) => {
          if (!uniqueObj[row[independentVar]]) {
            uniqueObj[row[independentVar]] = i;
            i++;
          }
          x_data.push(uniqueObj[row[independentVar]]);
        });
        x_labels = Object.keys(uniqueObj);
        console.log(x_labels);
      }

      if (dependentIsNumerical) {
        givenData.forEach((row) => y_data.push(parseFloat(row[dependentVar])));
      } else {
        //x and y is categorical
        let uniqueObj = {};
        let i = 1;
        givenData.forEach((row) => {
          if (!uniqueObj[row[dependentVar]]) {
            uniqueObj[row[dependentVar]] = i;
            i++;
          }

          y_data.push(uniqueObj[row[dependentVar]]);
        });
        y_labels = Object.keys(uniqueObj);
        console.log(y_labels);
      }

      let data = [];

      for (let i = 0; i < x_data.length; i++) {
        let x_rand = 0;
        let y_rand = 0;
        if (!independentIsNumerical && !dependentIsNumerical) {
          let angle = Math.random() * Math.PI * 2;
          let radius = Math.random() * 0.25;
          x_rand = Math.cos(angle) * radius;
          y_rand = Math.sin(angle) * radius;
        } else {
          if (independentIsNumerical) {
            y_rand = Math.random() * 0.2 - 0.1;
          }
          if (dependentIsNumerical) {
            x_rand = Math.random() * 0.2 - 0.1;
          }
        }
        data.push({ x: x_data[i] + x_rand, y: y_data[i] + y_rand });
      }
      data = data.filter(
        (row, index) =>
          row.x &&
          row.y &&
          row.x !== "undefined" &&
          row.y !== "undefined" &&
          index !== data.length - 1
      );
      console.log(data);
      independentVar = independentVar.toLowerCase().replaceAll("_", " ");
      independentVar =
        independentVar.charAt(0).toUpperCase() + independentVar.slice(1);
      dependentVar = dependentVar.toLowerCase().replaceAll("_", " ");
      dependentVar =
        dependentVar.charAt(0).toUpperCase() + dependentVar.slice(1);

      // Set dimensions
      let margin = {
          top: 100,
          right: 80,
          bottom: independentIsNumerical ? 60 : 110,
          left: dependentIsNumerical ? 70 : 130,
        },
        width = 800 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

      // Clear SVG before redrawing
      svg.selectAll("*").remove();

      const chart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Create scaling functions
      const xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.x)])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.y)])
        .range([height, 0]);

      // Draw circles
      chart
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 3)
        .attr("fill", "#31708E");

      // Draw axes
      chart
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(
          d3
            .axisBottom(xScale)
            .tickValues(
              independentIsNumerical ? null : d3.range(x_labels.length + 1)
            )
            .tickFormat((d, i) =>
              independentIsNumerical ? d : x_labels[i - 1]
            )
        )
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.5em")
        .attr("dy", "0.5em");

      chart.append("g").call(
        d3
          .axisLeft(yScale)
          .tickValues(
            dependentIsNumerical ? null : d3.range(y_labels.length + 1)
          )
          .tickFormat((d, i) => (dependentIsNumerical ? d : y_labels[i - 1]))
      );
      // X axis label
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 + margin.left + 20)
        .attr("y", height + margin.top + (independentIsNumerical ? 50 : 100))
        .text(independentVar.toLowerCase().replaceAll("_", " "));

      // Y axis label
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 4 - (dependentIsNumerical ? 0 : 20))
        .attr("x", -margin.top - height / 2 + 40)
        .text(dependentVar.toLowerCase().replaceAll("_", " "));

      // Title
      // svg
      //   .append("text")
      //   .attr("x", width / 2 + margin.left)
      //   .attr("y", margin.top / 2)
      //   .attr("text-anchor", "middle")
      //   .style("font-size", "16px")
      //   .style("font-weight", "bold")
      //   .text(
      //     `Scatterplot of ${independentVar
      //       .toUpperCase()
      //       .replaceAll("_", " ")} vs. ${dependentVar
      //       .toUpperCase()
      //       .replaceAll("_", " ")}`
      //   );
    }
  }, [givenData, independentVar, dependentVar]); // Redraw chart if data changes

  return (
    <svg
      className="d3-component"
      width={"38vw"}
      height={550}
      ref={d3Container}
    />
  );
};

export default Scatterplot;
