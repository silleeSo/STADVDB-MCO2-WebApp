// DeletePage.js
import React, { useState } from 'react';
import { executeQuery } from '../services/api'; // Import executeQuery function from api.js
import TableComponent from '../components/TableComponent'; // Import the new TableComponent

const DeletePage = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    const query = 'SELECT * FROM users';
    const result = await executeQuery(query);
    setTransactions(result.transactions); // Store the fetched data in state
  };

  const handleRowClick = (transaction) => {
    console.log('Selected Record:', transaction);
    // Add logic to delete the selected record if needed
  };

  return (
    <div>
      <h2>Delete Records</h2>
      <p>Select a record then press the delete button to delete the record!</p>
      
      <TableComponent transactions={transactions} onRowClick={handleRowClick} />

      <br />
      <button className="btn btn-primary btn-lg" onClick={fetchData}>
        Fetch Records
      </button>
    </div>
  );
};

export default DeletePage;
