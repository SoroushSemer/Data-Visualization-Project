import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Papa from "papaparse"; // Make sure to install papaparse using npm or yarn
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import "./App.css";

import PCABiplot from "./components/Lab2/PCABiplot";
import ScatterPlotMatrix from "./components/Lab2/ScatterPlotMatrix";
import KMeans from "./components/Lab2/KMeans";
import SumSquaresLoading from "./components/Lab2/SumSquaresLoading";
import ScreePlot from "./components/Lab2/ScreePlot";

function App() {
  const [csvData, setCsvData] = useState(null);
  const [page, setPage] = useState(2);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/dataset.csv"); // Replace with your actual CSV file path
        const text = await response.text();
        Papa.parse(text, {
          header: true,
          complete: (result) => {
            // Do something with the parsed CSV data
            console.log(result.data);
            setCsvData(result.data);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="App"
      style={{ backgroundColor: page === 1 ? "#fdfffd" : "white" }}
    >
      <header
        className="navs px-3 py-1 pt-2 w-100"
        style={{ backgroundColor: page === 1 ? "#317873" : "#9d47ba" }}
      >
        <h3
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <img
              src="logo.jpg"
              height="60vh"
              style={{ borderRadius: "50%", cursor: "pointer" }}
              onClick={() => window.location.reload(false)}
              alt="Data Visualization Logo"
            />
            <span className="mx-3 inline text-white">
              CSE 564 Data Visualization Dashboard - Billionares Data
            </span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", color: "white" }}
          >
            <span
              className="mx-3"
              onClick={() => setPage(1)}
              style={{
                cursor: "pointer",
                textDecoration: "none",
                fontSize: "24px",
                color: page === 1 ? "turquoise" : "white",
              }}
            >
              Lab 1
            </span>
            <span
              className="mx-3"
              onClick={() => setPage(2)}
              style={{
                cursor: "pointer",
                textDecoration: "none",
                fontSize: "24px",
                color: page === 2 ? "#e6d7ff" : "white",
              }}
            >
              Lab 2
            </span>
          </div>
        </h3>
      </header>
      {page === 1 ? (
        <Row className="w-100" style={{ height: "86vh", paddingLeft: "1vw" }}>
          <LeftPanel data={csvData} />
          <RightPanel data={csvData} />
        </Row>
      ) : (
        <div />
      )}
      {page === 2 ? (
        <Row className="w-95" style={{ height: "86vh", margin: "20px" }}>
          <Col
            xs={5}
            style={{
              height: "86vh",
              backgroundColor: "#e6d7ff",
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(61, 97, 82, 0.19)",
              borderRadius: "30px",
            }}
          >
            <ScatterPlotMatrix />
          </Col>
          <Col
            xs={3}
            style={{
              height: "86vh",
            }}
          >
            <Row
              style={{
                height: "50%",
                padding: "0px 20px 10px 20px",
              }}
            >
              <ScreePlot />
            </Row>
            <Row
              style={{
                height: "50%",
                padding: "10px 20px 0px 20px",
              }}
            >
              <KMeans />
            </Row>
          </Col>
          <Col
            xs={4}
            style={{
              height: "86vh",
            }}
          >
            <Row
              style={{
                height: "30%",
                paddingBottom: "10px",
              }}
            >
              <SumSquaresLoading />
            </Row>
            <Row
              style={{
                height: "70%",
                paddingTop: "10px",
              }}
            >
              <PCABiplot />
            </Row>
          </Col>
        </Row>
      ) : (
        <div />
      )}
    </div>
  );
}

export default App;
