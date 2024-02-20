import "../App.css";

import { Col, Row } from "react-bootstrap";
import BarChart from "./BarChart";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import ScatterPlot from "./ScatterPlot";
import { ToggleButtonGroup, ToggleButton, FormControl } from "@mui/material";

const scatterData = [
  { x: 10, y: 20 },
  { x: 30, y: 40 },
  { x: 50, y: 60 },
];

function RightPanel({ data }) {
  const [state, setState] = useState({
    variable1: "",
    variable2: "",
    isVertical: false,
    editingVar: "X",
  });
  const cols = data ? Object.keys(data[0]) : [];

  return (
    <Col className="w-50 h-100 m-3 panel">
      <h3
        style={{
          position: "absolute",
          top: "14vh",
          width: "30vw",
          textAlign: "center",
        }}
      >
        {state && state.variable1 && state.variable2
          ? `Scatterplot of ${state.variable1
              .toUpperCase()
              .replaceAll("_", " ")} vs. ${state.variable2
              .toUpperCase()
              .replaceAll("_", " ")}`
          : "Scatter Plot"}
      </h3>
      <ScatterPlot
        givenData={data}
        independentVar={state ? state.variable1 : ""}
        dependentVar={state ? state.variable2 : ""}
      />
      <Row style={{ position: "absolute", top: "80vh" }}>
        <Col>
          <Row>
            <strong>Select Axis:</strong>
          </Row>
          <Row style={{ width: "auto" }}>
            <ToggleButtonGroup
              size="large"
              value={state.editingVar}
              exclusive
              onChange={(e, currvar) =>
                setState({
                  ...state,
                  editingVar: state.editingVar === "X" ? "Y" : "X",
                })
              }
              aria-label="Large sizes"
              style={{
                height: "35px",
                color: "white",
              }}
            >
              <ToggleButton
                style={{ backgroundColor: "#6faeb0" }}
                value="X"
                key="X"
              >
                X
              </ToggleButton>
              <ToggleButton
                style={{ backgroundColor: "#6faeb0" }}
                value="Y"
                key="Y"
              >
                Y
              </ToggleButton>
            </ToggleButtonGroup>
          </Row>
        </Col>
        <Col>
          <strong>Select {state ? state.editingVar : ""} Variable: </strong>
          {state.editingVar === "X" ? (
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                style={{ minWidth: "10vw", backgroundColor: "#5f9ea0" }}
              >
                {state
                  ? state.variable1.toUpperCase().replaceAll("_", " ")
                  : "Select Variable 1"}
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  minWidth: "10vw",
                  textAlign: "center",
                  maxHeight: "300px",
                  overflowY: "scroll",
                }}
              >
                {cols.map((val) => (
                  <Dropdown.Item
                    onClick={() => {
                      setState({ ...state, variable1: val });
                    }}
                  >
                    {val.toUpperCase().replaceAll("_", " ")}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Dropdown>
              <Dropdown.Toggle
                id="dropdown-basic"
                style={{ minWidth: "10vw", backgroundColor: "#5f9ea0" }}
              >
                {state
                  ? state.variable2.toUpperCase().replaceAll("_", " ")
                  : "Select Variable 2"}
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  minWidth: "10vw",
                  textAlign: "center",
                  maxHeight: "300px",
                  overflowY: "scroll",
                }}
              >
                {cols.map((val) => (
                  <Dropdown.Item
                    onClick={() => {
                      setState({ ...state, variable2: val });
                    }}
                  >
                    {val.toUpperCase().replaceAll("_", " ")}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Col>
      </Row>
    </Col>
  );
}

export default RightPanel;
