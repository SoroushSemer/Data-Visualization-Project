import "../../App.css";
import Table from "react-bootstrap/Table";

const data = [
  { name: "x1", value: 0.9929294 },
  { name: "x2", value: 0.9360511 },
  { name: "x3", value: 0.9205652 },
  { name: "x4", value: 0.7805612 },
];

function SumSquaresLoading() {
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
      <h3 style={{ textAlign: "center", margin: "20px 0 25px" }}>
        Sum of Squares Loading
      </h3>
      <Table
        bordered
        responsive
        style={{
          backgroundColor: "#F3F8FF",
          maxWidth: "300px !important",
          marginBottom: "0 ",
          borderRadius: "25px",
        }}
      >
        <tbody>
          <tr>
            <th style={{ width: "100px" }}>Feature</th>
            {data.map((item) => (
              <td>{item.name}</td>
            ))}
          </tr>
          <tr>
            <th>Sum of Squares Loading</th>
            {data.map((item) => (
              <td>{item.value}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default SumSquaresLoading;
