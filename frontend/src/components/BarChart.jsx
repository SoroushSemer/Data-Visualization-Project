import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ colData, orientation, isHistogram, independentVar }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (colData && d3Container.current) {
      let columnCounts = {};
      let data = [];
      const isNumerical = colData.every(
        (row) => !isNaN(parseFloat(row[independentVar])) || !row[independentVar]
      );

      if (!isNumerical) {
        colData.forEach((row) => {
          columnCounts[row[independentVar]] =
            (columnCounts[row[independentVar]] || 0) + 1;
        });
        data = Object.entries(columnCounts).map(([name, value]) => ({
          name,
          value,
        }));
        data = data.filter((val) => val.name !== "undefined");
        console.log("categorical");
      } else {
        isHistogram = true;
        colData = colData.filter((row) => row[independentVar]);
        const values = colData.map((row) => +row[independentVar]);
        const max = d3.max(values);
        const min = d3.min(values);
        const binSize = Math.ceil((max - min) / 10);

        colData.forEach((row) => {
          const bin =
            Math.floor((+row[independentVar] - min) / binSize) * binSize + min;

          columnCounts[bin] = (columnCounts[bin] || 0) + 1;
        });

        data = Object.entries(columnCounts).map(([name, value]) => ({
          name:
            max > 1000000
              ? `${Math.round(parseFloat(+name) / 1000000)} M - ${Math.round(
                  (parseFloat(+name) + binSize > max
                    ? max
                    : parseFloat(+name) + binSize) / 1000000
                )} M`
              : +name +
                " - " +
                (parseFloat(+name) + binSize > max
                  ? max
                  : parseFloat(+name) + binSize
                ).toString(),
          value,
        }));
        data = data.filter((val) => val.name !== "NaN - NaN" && val.value);
        if (orientation === "horizontal") data = data.reverse();
        console.log("numerical");
      }
      console.log(data);
      const svg = d3.select(d3Container.current);

      // Set dimensions
      const margin = {
          top: 100,
          right: 75,
          bottom: 100,
          left: 140,
        },
        width = 800 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

      // Clear SVG before redrawing
      svg.selectAll("*").remove();

      const chart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      if (orientation === "vertical") {
        // Vertical Bar Chart
        const xScale = d3
          .scaleBand()
          .range([0, width])
          .domain(data.map((d) => d.name))
          .padding(isHistogram ? 0 : 0.1);

        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .range([height, 0]);

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
          .append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .attr("text-anchor", "end")
          .attr("dx", "-0.5em")
          .attr("dy", "0.5em");

        chart.append("g").call(d3.axisLeft(yScale));
        // X axis label
        independentVar = independentVar.toLowerCase().replaceAll("_", " ");
        independentVar =
          independentVar.charAt(0).toUpperCase() + independentVar.slice(1);

        svg
          .append("text")
          .attr("text-anchor", "middle")
          .attr("x", width / 2 + margin.left + 50)
          .attr("y", height + margin.top + 80)
          .text(independentVar);

        // Y axis label
        svg
          .append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .attr("y", margin.left / 4)
          .attr("x", -margin.top - height / 2 + 20)
          .text("Frequency");
      } else {
        // Horizontal Bar Chart
        const yScale = d3
          .scaleBand()
          .range([0, height])
          .domain(data.map((d) => d.name))
          .padding(isHistogram ? 0 : 0.1);

        const xScale = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.value)])
          .range([0, width]);

        chart
          .selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("y", (d) => yScale(d.name))
          .attr("x", 0)
          .attr("height", yScale.bandwidth())
          .attr("width", (d) => xScale(d.value))
          .attr("fill", "#31708E");

        chart
          .append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(xScale));

        chart.append("g").call(d3.axisLeft(yScale));

        // X axis label
        svg
          .append("text")
          .attr("text-anchor", "end")
          .attr("x", width / 2 + margin.left)
          .attr("y", height + margin.top + 40)
          .text("Frequency");

        // Y axis label
        svg
          .append("text")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .attr("y", margin.left / 4 - 5)
          .attr("x", -margin.top - height / 2 + 20)
          .text(independentVar);
      }

      // svg
      //   .append("text")
      //   .attr("x", width / 2 + margin.left)
      //   .attr("y", margin.top / 2)
      //   .attr("text-anchor", "middle")
      //   .style("font-size", "28px")
      //   .style("font-weight", "bold")
      //   .text(
      //     `${isNumerical ? "Histogram" : "Bar Chart"} of ${independentVar
      //       .toUpperCase()
      //       .replaceAll("_", " ")}`
      //   );
    }
  }, [colData, orientation, isHistogram, independentVar]); // Redraw chart if data changes

  return (
    <svg
      className="d3-component"
      width={"38vw"}
      height={550}
      ref={d3Container}
    />
  );
};

export default BarChart;
