import React, { useEffect, useState, useContext } from "react";
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

import { GlobalStoreContext, GlobalStoreContextProvider } from "./store/store";

function App() {
  const [csvData, setCsvData] = useState(null);
  const [page, setPage] = useState(3);

  const { store, loading } = useContext(GlobalStoreContext);

  var primaryColor = "#317873";
  var secondaryColor = "#e0ede0";

  switch (page) {
    case 1:
      primaryColor = "#317873";
      secondaryColor = "#e0ede0";
      break;
    case 2:
      primaryColor = "#9d47ba";
      secondaryColor = "#e6d7ff";
      break;
    case 3:
      primaryColor = "#2c3e50";
      secondaryColor = "#eeefff";
      break;
    default:
      primaryColor = "#000000";
      secondaryColor = "#e0ede0";
  }
  // const { store } = useContext(GlobalStoreContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/dataset.csv"); // Replace with your actual CSV file path
        const text = await response.text();
        Papa.parse(text, {
          header: true,
          complete: (result) => {
            // Do something with the parsed CSV data
            // console.log(result.data);
            setCsvData(result.data);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }

      // if (store) store.updateData();
    };

    fetchData();
  }, []);

  return (
    <div className="App" style={{ backgroundColor: "white" }}>
      <GlobalStoreContextProvider>
        <header
          className="navs px-3 py-1 pt-2 w-100"
          style={{ backgroundColor: primaryColor }}
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
                  color: page === 1 ? secondaryColor : "white",
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
                  color: page === 2 ? secondaryColor : "white",
                }}
              >
                Lab 2a
              </span>
              <span
                className="mx-3"
                onClick={() => setPage(3)}
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  fontSize: "24px",
                  color: page === 3 ? secondaryColor : "white",
                }}
              >
                Lab 2b
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
              style={{
                height: "86vh",
                width: "40%",
              }}
            >
              <Row
                style={{
                  height: "70%",
                  paddingBottom: "10px",
                }}
              >
                <PCABiplot />
              </Row>
              <Row
                style={{
                  height: "30%",
                  paddingTop: "10px",
                }}
              >
                <SumSquaresLoading />
              </Row>
            </Col>

            <Col
              style={{
                height: "86vh",
                width: "20%",
              }}
            >
              <Row
                style={{
                  height: "50%",
                  padding: "0px 20px 10px 20px",
                }}
              >
                <KMeans />
              </Row>
              <Row
                style={{
                  height: "50%",
                  padding: "10px 20px 0px 20px",
                }}
              >
                <ScreePlot />
              </Row>
            </Col>
            <Col
              style={{
                height: "86vh",
                width: "40%",
                backgroundColor: "#e6d7ff",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(61, 97, 82, 0.19)",
                borderRadius: "30px",
              }}
            >
              <ScatterPlotMatrix />
            </Col>
          </Row>
        ) : (
          <div />
        )}
        {page === 3 ? (
          <div>
            <Row
              className="w-95"
              style={{
                height: "30vh",
                margin: "10px",
                backgroundColor: secondaryColor,
              }}
            ></Row>
            <Row
              className="w-95"
              style={{
                height: "57vh",
                margin: "10px",
                backgroundColor: secondaryColor,
                borderRadius: "30px",
              }}
            ></Row>
          </div>
        ) : (
          <div />
        )}
      </GlobalStoreContextProvider>
    </div>
  );
}

export default App;
