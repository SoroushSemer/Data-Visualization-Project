import "../../App.css";
import Table from "react-bootstrap/Table";
import { useContext } from "react";
import { GlobalStoreContext } from "../../store/store.js";
import { Spinner } from "react-bootstrap";
// const data = [
//   { name: "cpi_country", value: 0.9734373354098129 },
//   { name: "gross_tertiary_education_enrollment", value: 0.9491546333244391 },
//   { name: "total_tax_rate_country", value: 0.9146490668225984 },
//   { name: "age", value: 0.49776393194475954 },
// ];

function SumSquaresLoading() {
  const { store, loading } = useContext(GlobalStoreContext);
  let data = store ? store.sum_of_squares_loading : [];

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
                <td style={{ textWrap: "wrap" }}>
                  {item.name.length > 15
                    ? item.name.slice(0, 18) + "..."
                    : item.name}
                </td>
              ))}
            </tr>
            <tr>
              <th>Sum of Squares Loading</th>
              {data.map((item) => (
                <td>{item.value.toFixed(5)}</td>
              ))}
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default SumSquaresLoading;
