import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  // Fetch data from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching data!', error);
      });
  }, []);

  // Handle row click
  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  // Handle delete button click
  const handleDelete = () => {
    if (selectedRow) {
      axios.delete(`http://localhost:5000/data/${selectedRow.id}`)
        .then(response => {
          console.log(response.data.message);
          // Remove deleted row from the state
          setData(data.filter(item => item.id !== selectedRow.id));
          setSelectedRow(null); // Reset selected row
        })
        .catch(error => {
          console.error('There was an error deleting the data!', error);
        });
    }
  };

  return (
    <div>
      <h2>My Table</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Release Date</th>
            <th>Release Year</th>
            <th>Price</th>
            <th>Positive Reviews</th>
            <th>Negative Reviews</th>
            <th>User Score</th>
            <th>Metacritic Score</th>
            <th>Average Playtime Forever</th>
            <th>Average Playtime 2 Weeks</th>
            <th>Median Playtime Forever</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row)}
              style={{ cursor: 'pointer', backgroundColor: selectedRow === row ? '#d3d3d3' : 'transparent' }}
            >
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td><button className="btn btn-danger">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRow && (
        <div>
          <h4>Selected Row: {selectedRow.name}</h4>
          <button onClick={handleDelete} className="btn btn-danger">
            Confirm Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
