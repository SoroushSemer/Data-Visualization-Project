import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import Papa from 'papaparse'; // Make sure to install papaparse using npm or yarn
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

function App() {
  const [csvData, setCsvData] = useState(null);
  const [page, setPage] = useState(1)
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
    <div className="App" style={{ backgroundColor: page === 1 ? "#fdfffd": "#fff1f9" }}>
      <header className="navs px-3 py-1 pt-2 w-100" style={{backgroundColor: page === 1? "#317873": "#896790"}}>
      <h3 style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
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
            </div>
            <div style={{display:"flex", alignItems:"center", color:"white"}}>
              <span className='mx-3' onClick={()=>setPage(1)} style={{cursor:"pointer", textDecoration:"none", fontSize:"24px", color: page===1 ? "turquoise":"white"}}>Lab 1</span>
              <span className='mx-3' onClick={()=>setPage(2)} style={{cursor:"pointer", textDecoration:"none", fontSize:"24px", color: page===2 ? "pink":"white"}}>Lab 2</span>
            </div>
          </h3>
      </header>
      {page===1 ?
      <Row className='w-100' style={{ height: "87vh", paddingLeft: "1vw" }}>
        <LeftPanel data={csvData}/>
        <RightPanel data={csvData} />
      </Row>:<div/>
      }
      {page===2 ?
      <Row className='w-100' style={{ height: "87vh", paddingLeft: "1vw" }}>
        <div>Lab 2</div> 
      </Row>:<div/>
      }
    </div>
  );
}

export default App;
