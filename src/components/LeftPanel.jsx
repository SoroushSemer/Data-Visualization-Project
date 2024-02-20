import "../App.css";

import { Col, Dropdown } from "react-bootstrap";
import BarChart from "./BarChart";
import { useEffect, useState } from "react";
import { ToggleButtonGroup, ToggleButton, FormControl } from "@mui/material";
import AlignVerticalBottomIcon from "@mui/icons-material/AlignVerticalBottom";
import AlignHorizontalLeftIcon from "@mui/icons-material/AlignHorizontalLeft";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const data = [
  { name: "Sun", value: 100 },
  { name: "Mon", value: 50 },
  { name: "Tue", value: 500 },
  { name: "Wed", value: 300 },
  { name: "Thu", value: 200 },
  { name: "Fri", value: 20 },
];

function LeftPanel({ data }) {
  const [state, setState] = useState({
    variable: "",
    orientation: "vertical",
  });
  console.log(data);
  const cols = data ? Object.keys(data[0]) : [];

  const setVariable = (val) => {
    setState({ ...state, variable: val });
  };

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
        {state && state.variable
          ? `Chart of ${state.variable.toUpperCase().replaceAll("_", " ")} `
          : "Bar Chart / Histogram"}
      </h3>
      <div>
        <BarChart
          style={{ marginTop: "100px" }}
          colData={data}
          orientation={state.orientation}
          independentVar={state ? state.variable : ""}
        />
      </div>
      <ToggleButtonGroup
        size="large"
        value={state.orientation}
        exclusive
        onChange={(e, orientation) =>
          setState({
            ...state,
            orientation: orientation === "vertical" ? "vertical" : "horizontal",
          })
        }
        aria-label="Large sizes"
        style={{
          marginTop: "30px",
          marginRight: "30px",
          height: "50px",
          backgroundColor: "#6faeb0",
          color: "white",
        }}
      >
        <ToggleButton value="vertical" key="vertical">
          <AlignVerticalBottomIcon />
        </ToggleButton>
        <ToggleButton value="horizontal" key="horizontal">
          <AlignHorizontalLeftIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      <div style={{ position: "absolute", top: "80vh" }}>
        <strong>Select Variable: </strong>

        <Dropdown>
          <Dropdown.Toggle
            id="dropdown-basic"
            style={{ minWidth: "10vw", backgroundColor: "#5f9ea0" }}
          >
            {state
              ? state.variable.toUpperCase().replaceAll("_", " ")
              : "Select Variable"}
          </Dropdown.Toggle>

          <Dropdown.Menu
            style={{
              minWidth: "10vw",
              // textAlign: "center",
              maxHeight: "300px",
              overflowY: "scroll",
            }}
          >
            {cols.map((val) => (
              <Dropdown.Item onClick={() => setVariable(val)}>
                {val.toUpperCase().replaceAll("_", " ")}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Col>
  );
}

export default LeftPanel;
