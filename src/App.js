import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import Papa from 'papaparse'; // Make sure to install papaparse using npm or yarn
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

function App() {
  const [csvData, setCsvData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dataset.csv'); // Replace with your actual CSV file path
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
        console.error('Error fetching CSV data:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className="App" style={{ backgroundColor: "#fdfffd" }}>
       <header className="navs px-3 py-1 pt-2 w-100">
      <h3>
            <img
              src='logo.jpg'
              height="60vh"
              style={{ borderRadius: "50%", cursor: "pointer" }}
              onClick={() => window.location.reload(false)}
              alt="Data Visualization Logo"
            />
            <span className="mx-3 inline text-white">
              CSE 564 Data Visualization Dashboard - Billionares Data
            </span>
          </h3>
      </header>
      <Row className='w-100' style={{ height: "87vh", paddingLeft: "1vw" }}>
        <LeftPanel data={csvData}/>
        <RightPanel data={csvData} />
      </Row>
    </div>
  );
}

export default App;
