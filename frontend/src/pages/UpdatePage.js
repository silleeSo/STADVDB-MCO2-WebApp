import React, { useState } from 'react';
import { executeQuery } from '../services/api'; // Import executeQuery function from api.js
import TableComponent from '../components/TableComponent';

const UpdatePage = () => {
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
      <h2>Update Records</h2>
      <p>Select a record then press the update button to update the record!</p>
      
      <TableComponent transactions={transactions} onRowClick={handleRowClick} />

      <br />
      <button className="btn btn-primary btn-lg" onClick={fetchData}>
        Update Record
      </button>
    </div>
  );
};

export default UpdatePage;
